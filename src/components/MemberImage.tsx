import React from 'react';

interface MemberImageProps {
  member: {
    name: string;
    profileImage?: string;
    image?: string; // Legacy field for backward compatibility
    alt?: string;
  };
  size?: 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  showBorder?: boolean;
}

const MemberImage: React.FC<MemberImageProps> = ({ 
  member, 
  size = 'medium', 
  style = {}, 
  className = '',
  onClick,
  showBorder = false
}) => {
  // Size configurations
  const sizeConfig = {
    small: { width: '80px', height: '80px', fontSize: '1.5rem' },
    medium: { width: '150px', height: '150px', fontSize: '2.5rem' },
    large: { width: '200px', height: '200px', fontSize: '3rem' }
  };

  const config = sizeConfig[size];
  const imageUrl = member.profileImage || member.image;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // Try to load the SVG placeholder first
    target.src = '/assets/images/placeholder.svg';
    // If that also fails, hide the image and show the placeholder div
    target.onerror = () => {
      target.style.display = 'none';
      const parent = target.parentElement;
      if (parent) {
        const placeholder = parent.querySelector('.member-placeholder') as HTMLElement;
        if (placeholder) {
          placeholder.style.display = 'flex';
        }
      }
    };
  };

  return (
    <div 
      className={`member-image-container ${className}`}
      style={{
        position: 'relative',
        width: config.width,
        height: config.height,
        aspectRatio: '1 / 1',
        overflow: 'visible',
        ...style
      }}
      onClick={onClick}
    >
      {/* Image */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={member.alt || member.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
            cursor: onClick ? 'pointer' : 'default',
            transition: 'transform 0.2s ease-in-out',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            imageRendering: 'auto',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            border: showBorder ? '3px solid #0066CC' : 'none',
            display: 'block'
          }}
          onError={handleImageError}
          onMouseEnter={(e) => {
            if (onClick) {
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (onClick) {
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        />
      )}
      
      {/* Placeholder (shown when no image or image fails to load) */}
      <div 
        className="member-placeholder"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f8f9fa',
          borderRadius: '50%',
          display: imageUrl ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'transform 0.2s ease-in-out',
          border: showBorder ? '3px solid #0066CC' : '2px dashed #dee2e6',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          overflow: 'visible'
        }}
        onMouseEnter={(e) => {
          if (onClick) {
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (onClick) {
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        <span style={{ fontSize: config.fontSize, color: '#6c757d' }}>👤</span>
      </div>
    </div>
  );
};

export default MemberImage; 