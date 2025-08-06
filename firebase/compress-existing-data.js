const admin = require('firebase-admin');
const sharp = require('sharp');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Helper function to compress base64 image
const compressBase64Image = async (base64String) => {
  try {
    // Remove data URL prefix
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Compress image
    const compressedBuffer = await sharp(buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 60, progressive: true })
      .toBuffer();
    
    // Convert back to base64
    return `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Failed to compress image:', error);
    return base64String; // Return original if compression fails
  }
};

// Helper function to estimate document size
const estimateDocumentSize = (data) => {
  const jsonString = JSON.stringify(data);
  return Buffer.byteLength(jsonString, 'utf8');
};

// Compress gallery events
const compressGalleryEvents = async () => {
  const db = admin.firestore();
  const eventsSnapshot = await db.collection('gallery_events').get();
  
  console.log(`Found ${eventsSnapshot.size} gallery events to process...`);
  
  let processed = 0;
  let compressed = 0;
  
  for (const doc of eventsSnapshot.docs) {
    const eventData = doc.data();
    const originalSize = estimateDocumentSize(eventData);
    
    console.log(`Processing event: ${eventData.name} (${doc.id})`);
    console.log(`Original size: ${Math.round(originalSize/1024)}KB`);
    
    let needsUpdate = false;
    const updatedData = { ...eventData };
    
    // Compress thumbnail
    if (eventData.thumbnail && eventData.thumbnail.startsWith('data:image/')) {
      console.log('Compressing thumbnail...');
      const compressedThumbnail = await compressBase64Image(eventData.thumbnail);
      updatedData.thumbnail = compressedThumbnail;
      needsUpdate = true;
    }
    
    // Compress event images
    if (eventData.images && eventData.images.length > 0) {
      console.log(`Compressing ${eventData.images.length} event images...`);
      for (let i = 0; i < eventData.images.length; i++) {
        if (eventData.images[i].src && eventData.images[i].src.startsWith('data:image/')) {
          const compressedImage = await compressBase64Image(eventData.images[i].src);
          updatedData.images[i].src = compressedImage;
          needsUpdate = true;
        }
      }
    }
    
    if (needsUpdate) {
      const newSize = estimateDocumentSize(updatedData);
      console.log(`New size: ${Math.round(newSize/1024)}KB`);
      console.log(`Size reduction: ${Math.round((originalSize - newSize)/1024)}KB`);
      
      if (newSize > 900000) {
        console.log('⚠️  WARNING: Document still too large after compression!');
        console.log('Consider reducing the number of images or further compression.');
      } else {
        // Update the document
        await doc.ref.update(updatedData);
        compressed++;
        console.log('✅ Event compressed and updated successfully');
      }
    } else {
      console.log('ℹ️  No compression needed (already compressed or no images)');
    }
    
    processed++;
    console.log('---');
  }
  
  console.log(`\nCompression complete!`);
  console.log(`Processed: ${processed} events`);
  console.log(`Compressed: ${compressed} events`);
};

// Compress gallery years
const compressGalleryYears = async () => {
  const db = admin.firestore();
  const yearsSnapshot = await db.collection('gallery_years').get();
  
  console.log(`Found ${yearsSnapshot.size} gallery years to process...`);
  
  let processed = 0;
  let compressed = 0;
  
  for (const doc of yearsSnapshot.docs) {
    const yearData = doc.data();
    const originalSize = estimateDocumentSize(yearData);
    
    console.log(`Processing year: ${yearData.year} (${doc.id})`);
    console.log(`Original size: ${Math.round(originalSize/1024)}KB`);
    
    let needsUpdate = false;
    const updatedData = { ...yearData };
    
    // Compress year image
    if (yearData.image && yearData.image.startsWith('data:image/')) {
      console.log('Compressing year image...');
      const compressedImage = await compressBase64Image(yearData.image);
      updatedData.image = compressedImage;
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      const newSize = estimateDocumentSize(updatedData);
      console.log(`New size: ${Math.round(newSize/1024)}KB`);
      console.log(`Size reduction: ${Math.round((originalSize - newSize)/1024)}KB`);
      
      if (newSize > 900000) {
        console.log('⚠️  WARNING: Document still too large after compression!');
      } else {
        // Update the document
        await doc.ref.update(updatedData);
        compressed++;
        console.log('✅ Year compressed and updated successfully');
      }
    } else {
      console.log('ℹ️  No compression needed (already compressed or no image)');
    }
    
    processed++;
    console.log('---');
  }
  
  console.log(`\nCompression complete!`);
  console.log(`Processed: ${processed} years`);
  console.log(`Compressed: ${compressed} years`);
};

// Main function
const main = async () => {
  try {
    console.log('Starting data compression...\n');
    
    console.log('=== Compressing Gallery Events ===');
    await compressGalleryEvents();
    
    console.log('\n=== Compressing Gallery Years ===');
    await compressGalleryYears();
    
    console.log('\n🎉 All compression tasks completed!');
  } catch (error) {
    console.error('Error during compression:', error);
  } finally {
    process.exit(0);
  }
};

// Run the script
main(); 