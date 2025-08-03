# Bidirectional Family Relationships

## Overview

This feature creates bidirectional family relationships between members. When you link a family member to an existing member, the relationship is automatically created in both profiles.

## How It Works

### 1. Automatic Inverse Relationships
When you link Member A as "Father" to Member B, the system automatically:
- Adds Member A as "Father" to Member B's family list
- Adds Member B as "Child" to Member A's family list

### 2. Relationship Mapping
The system uses intelligent inverse relationship mapping:

| Relationship | Inverse Relationship |
|--------------|---------------------|
| Spouse | Spouse |
| Father | Child |
| Mother | Child |
| Child | Parent |
| Son | Parent |
| Daughter | Parent |
| Brother | Brother |
| Sister | Sister |
| Grandfather | Grandchild |
| Grandmother | Grandchild |
| Uncle | Nephew/Niece |
| Aunt | Nephew/Niece |
| Cousin | Cousin |
| Other | Other |

### 3. API Endpoint
**POST** `/api/members/:id/family/link`

Creates a bidirectional family relationship between two members.

**Request Body:**
```json
{
  "targetMemberId": "member-id",
  "relationship": "Spouse"
}
```

**Response:**
```json
{
  "message": "Family relationship created successfully",
  "sourceMember": { /* member data */ },
  "targetMember": { /* member data */ }
}
```

## Usage

### Through Admin Interface
1. Go to Admin panel → Members → Edit a member
2. Navigate to "Family Members" tab
3. Click "Link Existing Member"
4. Search for the member you want to link
5. Select the relationship type
6. The system automatically creates the relationship in both profiles

### Example Scenarios

#### Scenario 1: Husband and Wife
- John Doe (member) links Jane Doe (member) as "Spouse"
- Result: 
  - John's profile shows Jane as "Spouse"
  - Jane's profile shows John as "Spouse"

#### Scenario 2: Parent and Child
- John Doe (member) links Sarah Doe (member) as "Daughter"
- Result:
  - John's profile shows Sarah as "Daughter"
  - Sarah's profile shows John as "Parent"

#### Scenario 3: Siblings
- John Doe (member) links Mike Doe (member) as "Brother"
- Result:
  - John's profile shows Mike as "Brother"
  - Mike's profile shows John as "Brother"

## Benefits

1. **Automatic Consistency**: Relationships are always consistent between both members
2. **Easy Discovery**: When viewing any member's profile, you can see all their family relationships
3. **Bidirectional Navigation**: Easy to navigate between related members
4. **Data Integrity**: Prevents orphaned or inconsistent family relationships

## Technical Implementation

### Backend
- New API endpoint for creating bidirectional relationships
- Automatic inverse relationship calculation
- Database updates for both members simultaneously
- Error handling and validation

### Frontend
- Enhanced admin interface with member search
- Automatic relationship mapping
- Success/error feedback to users
- Real-time UI updates

## Error Handling

- Validates that both members exist
- Checks for duplicate relationships
- Handles network errors gracefully
- Provides user-friendly error messages

## Future Enhancements

1. **Relationship Validation**: Prevent invalid relationships (e.g., same person as both parent and child)
2. **Bulk Operations**: Link multiple family members at once
3. **Relationship History**: Track when relationships were created/modified
4. **Advanced Search**: Search by relationship type
5. **Family Trees**: Visual representation of family relationships 