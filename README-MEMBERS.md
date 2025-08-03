# Dynamic Members System

This system allows you to dynamically manage all member information for the Rotary Club of Cochin Lakeside website. All member information is stored in a single JSON file and loaded dynamically across all pages.

## Files Created/Modified

### New Files:
- `public/assets/data/members.json` - Contains all member data in a unified structure
- `src/pages/Admin.tsx` - React-based admin interface to manage member data

### Modified Files:
- `src/pages/Home.tsx` - Updated to use dynamic loading for directors carousel
- `src/pages/Directors.tsx` - Updated to use dynamic loading for directors and office bearers
- `src/pages/PastPresidents.tsx` - Updated to use dynamic loading for past presidents

## How It Works

### 1. Unified Data Structure
The `members.json` file contains a single array of all members with comprehensive information:

```json
{
  "members": [
    {
      "id": "sachin-v-suresh",
      "name": "Rtn Sachin V Suresh",
      "image": "assets/images/photo-816x817.jpeg",
      "alt": "Sachin",
      "currentPosition": "President",
      "pastPositions": [],
      "isPastPresident": false,
      "presidentialYears": [],
      "link": "sachin.html"
    },
    {
      "id": "george-palathingal",
      "name": "Rtn George Palathingal",
      "image": "assets/images/img-5218-3648x2432.jpeg",
      "alt": "George Palathingal",
      "currentPosition": "Immediate Past President",
      "pastPositions": ["President"],
      "isPastPresident": true,
      "presidentialYears": ["2019-2020"]
    }
  ]
}
```

### 2. Dynamic Loading
The React components automatically:
- Load the JSON data when pages load
- Filter members based on their current positions for directors sections
- Filter members who are past presidents for the past presidents page
- Display all members in the members page

### 3. Admin Interface
The admin interface at `/admin` (React component) provides:
- Form to add new members with all their information
- Visual display of all members with their positions and history
- Ability to delete members
- Export functionality to download the JSON file
- Save functionality (requires server-side implementation)

## Member Properties

Each member in the JSON has the following properties:

- `id`: Unique identifier (auto-generated)
- `name`: Full name with "Rtn" prefix
- `image`: Path to the member's photo
- `alt`: Alt text for the image
- `currentDesignation`: Current designation/title (null if no current designation)
- `pastPositions`: Array of past positions held
- `isPastPresident`: Boolean indicating if they were a past president
- `presidentialYears`: Array of years they served as president (if applicable)
- `link`: Optional link to member's profile page

## How to Use

### Adding New Members

1. **Via Admin Interface (Recommended):**
   - Navigate to `/admin` in your React application
   - Use the "Add New Member" tab
   - Fill out all the member information
   - Check "Is Past President" if applicable
   - Add presidential years if they were a past president
   - Click "Add Member" to add them to the list

2. **Via JSON File:**
   - Open `public/assets/data/members.json`
   - Add new entries to the `members` array
   - Follow the existing format for consistency

### Managing Member Information

1. **Current Position Changes:**
   - Update the `currentDesignation` field in the JSON
   - Set to `null` if member no longer holds a position

2. **Adding Past Presidents:**
   - Set `isPastPresident: true`
   - Add presidency years to `presidentialYears` array
   - Add "President" to `pastPositions` array

3. **Tracking Position History:**
   - Add all past positions to the `pastPositions` array
   - This helps track a member's complete history

4. **Removing Members:**
   - Use the admin interface to delete members
   - Or manually remove entries from the JSON file

### Image Guidelines

- Store all member photos in `public/assets/images/`
- Use descriptive filenames
- Recommended size: 816x816 pixels or similar square aspect ratio
- Supported formats: JPG, JPEG, PNG
- Keep file sizes reasonable (under 500KB per image)

## Benefits

1. **Single Source of Truth:** All member information in one place
2. **Complete History:** Track current and past positions
3. **Easy Updates:** No need to edit multiple files
4. **Consistency:** Ensures member information is consistent across all pages
5. **Scalability:** Easy to add new members or update information
6. **Flexibility:** Support for complex member histories

## Technical Notes

- The system uses React with TypeScript for type safety
- JSON file is loaded via fetch API
- Admin interface uses Bootstrap for styling
- All member images should be in the public/assets/images directory
- The system automatically handles missing images gracefully
- Components filter data based on specific criteria (current positions, past presidents, etc.)

## Troubleshooting

### Common Issues:

1. **Images not loading:**
   - Check that image paths in JSON are correct
   - Ensure images exist in the specified location
   - Verify image file permissions

2. **Members not appearing:**
   - Check browser console for JavaScript errors
   - Verify JSON syntax is valid
   - Ensure the component is filtering correctly

3. **Admin interface not working:**
   - Must be served from a web server (not file:// protocol)
   - Check browser console for CORS errors
   - Ensure proper file permissions

### Browser Compatibility:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ support for async/await
- Fetch API support required

## Future Enhancements

1. **Server-side Integration:** Implement proper save functionality
2. **Image Upload:** Add image upload capability to admin interface
3. **Member Profiles:** Create individual profile pages for each member
4. **Search/Filter:** Add search and filter capabilities
5. **Bulk Import:** Allow importing member data from CSV/Excel files
6. **Edit Functionality:** Complete the edit member feature in admin interface 