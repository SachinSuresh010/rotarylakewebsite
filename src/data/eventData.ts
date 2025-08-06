export interface EventImage {
  id: string;
  src: string;
  alt: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  images: EventImage[];
}

export interface YearEvents {
  year: string;
  events: Event[];
}

// 2022-2023 Events
export const events2022: Event[] = [
  {
    id: "installation-ceremony-2022",
    name: "Installation Ceremony 2022-23",
    description: "A memorable evening celebrating leadership and service",
    thumbnail: "/assets/images/img-5252-816x544.jpeg",
    images: [
      { id: "img-5047", src: "/assets/images/img-5047-1288x859.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5041", src: "/assets/images/img-5041-1288x859.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5038", src: "/assets/images/img-5038-1288x859.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5054", src: "/assets/images/img-5054-1305x870.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5057", src: "/assets/images/img-5057-5472x3648.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5084", src: "/assets/images/img-5084-3648x5472.jpeg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5063", src: "/assets/images/img-5063-3648x5472.jpeg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5070", src: "/assets/images/img-5070-5472x3648.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5075", src: "/assets/images/img-5075-5472x3648.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5080", src: "/assets/images/img-5080-3648x5472.jpeg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5082", src: "/assets/images/img-5082-3648x5472.jpeg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5321", src: "/assets/images/img-5321-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5088", src: "/assets/images/img-5088-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5090", src: "/assets/images/img-5090-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5093", src: "/assets/images/img-5093-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5096", src: "/assets/images/img-5096-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5103", src: "/assets/images/img-5103-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5118", src: "/assets/images/img-5118-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5119", src: "/assets/images/img-5119-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5123", src: "/assets/images/img-5123-3648x5472.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5131", src: "/assets/images/img-5131-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5133", src: "/assets/images/img-5133-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5138", src: "/assets/images/img-5138-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5140", src: "/assets/images/img-5140-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5142", src: "/assets/images/img-5142-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5151", src: "/assets/images/img-5151-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5153", src: "/assets/images/img-5153-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5159", src: "/assets/images/img-5159-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5171", src: "/assets/images/img-5171-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5177", src: "/assets/images/img-5177-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5178", src: "/assets/images/img-5178-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5179", src: "/assets/images/img-5179-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5180", src: "/assets/images/img-5180-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5181", src: "/assets/images/img-5181-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5182", src: "/assets/images/img-5182-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5183", src: "/assets/images/img-5183-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5201", src: "/assets/images/img-5201-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5207", src: "/assets/images/img-5207-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5209", src: "/assets/images/img-5209-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5212", src: "/assets/images/img-5212-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5214", src: "/assets/images/img-5214-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5216", src: "/assets/images/img-5216-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5218", src: "/assets/images/img-5218-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5221", src: "/assets/images/img-5221-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5224", src: "/assets/images/img-5224-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5227", src: "/assets/images/img-5227-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5230", src: "/assets/images/img-5230-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5246", src: "/assets/images/img-5246-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5251", src: "/assets/images/img-5251-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5267", src: "/assets/images/img-5267-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5284", src: "/assets/images/img-5284-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5291", src: "/assets/images/img-5291-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5296", src: "/assets/images/img-5296-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5300", src: "/assets/images/img-5300-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5306", src: "/assets/images/img-5306-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5309", src: "/assets/images/img-5309-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5313", src: "/assets/images/img-5313-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5315", src: "/assets/images/img-5315-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5319", src: "/assets/images/img-5319-3648x2432.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5396", src: "/assets/images/img-5396-5472x3648.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5322", src: "/assets/images/img-5322-5472x3648.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5359", src: "/assets/images/img-5359-5472x3648.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5365", src: "/assets/images/img-5365-5472x3648.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5367", src: "/assets/images/img-5367-5472x3648.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5371", src: "/assets/images/img-5371-5472x3648.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5377", src: "/assets/images/img-5377-5472x3648.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5378", src: "/assets/images/img-5378-5472x3648.jpg", alt: "Installation Ceremony 2022-23" },
      { id: "img-5394", src: "/assets/images/img-5394-5472x3648.jpg", alt: "Installation Ceremony 2022-23" }
    ]
  },
  {
    id: "club-meetings-2022",
    name: "Club Meetings",
    description: "Weekly gatherings and special events",
    thumbnail: "/assets/images/gb-22-09-22-001-816x612.jpeg",
    images: [
      { id: "gb-22-09-22", src: "/assets/images/gb-22-09-22-001-816x612.jpeg", alt: "Club Meeting" },
    ]
  },
  {
    id: "onam-celebration-2022",
    name: "Onam Celebration",
    description: "Traditional Onam celebrations with club members",
    thumbnail: "/assets/images/0eb433d2-d2f3-4a45-b0b4-337ab117a7ed-816x612.jpeg",
    images: [
      { id: "onam-1", src: "/assets/images/0eb433d2-d2f3-4a45-b0b4-337ab117a7ed-816x612.jpeg", alt: "Onam Celebration" }
      // Add more Onam celebration images here
    ]
  },
  {
    id: "christmas-newyear-2022",
    name: "Christmas and New Year Celebrations",
    description: "Festive celebrations with club members and families",
    thumbnail: "/assets/images/3417d14c-f989-4d22-bcb1-c24acdeb8c7b-1600x721.jpg",
    images: [
      { id: "christmas-1", src: "/assets/images/3417d14c-f989-4d22-bcb1-c24acdeb8c7b-1600x721.jpg", alt: "Christmas and New Year Celebrations" },
      // Add more Christmas/New Year images here
    ]
  },
  {
    id: "family-tour-2022",
    name: "Family Tour",
    description: "Family bonding activities and tours",
    thumbnail: "/assets/images/5e8ef2d2-1bc2-4ade-b54b-4cb0b0d18e0e-1600x720.jpg",
    images: [
      { id: "family-1", src: "/assets/images/5e8ef2d2-1bc2-4ade-b54b-4cb0b0d18e0e-1600x720.jpg", alt: "Family Tour" },
      // Add more family tour images here
    ]
  },
  {
    id: "district-events-2022",
    name: "District Events",
    description: "Participation in district-level events and activities",
    thumbnail: "/assets/images/fe2cd234-d745-4982-a515-6150120657ce-1280x960.jpg",
    images: [
      { id: "district-1", src: "/assets/images/fe2cd234-d745-4982-a515-6150120657ce-1280x960.jpg", alt: "District Events" }
      // Add more district event images here
    ]
  },
  {
    id: "other-events-2022",
    name: "Other Club Events",
    description: "Various other club events and activities",
    thumbnail: "/assets/images/9348f58f-f7a0-4ad7-81ba-725e8146f8f7-960x1280.jpeg",
    images: [
      { id: "other-1", src: "/assets/images/9348f58f-f7a0-4ad7-81ba-725e8146f8f7-960x1280.jpeg", alt: "Other Club Events" },
      { id: "other-2", src: "/assets/images/1d014944-8fd3-4203-a77b-f0c762068037-816x612.jpg", alt: "Other Club Events" },
      // Add more other event images here
    ]
  }
];

// 2023-2024 Events
export const events2023: Event[] = [
  {
    id: "installation-ceremony-2023",
    name: "Installation Ceremony 2023-24",
    description: "Installation of the new board for 2023-2024",
    thumbnail: "/assets/images/whatsapp-image-2023-06-25-at-12.53.19-pm-816x614.jpg",
    images: [
      { id: "install-2023-1", src: "/assets/images/whatsapp-image-2023-06-25-at-12.53.19-pm-816x614.jpg", alt: "Installation Ceremony 2023-24" },
      { id: "install-2023-2", src: "/assets/images/whatsapp-image-2023-06-25-at-12.53.19-pm-1256x945.jpg", alt: "Installation Ceremony 2023-24" }
      // Add more 2023 installation images here
    ]
  },
  {
    id: "club-meetings-2023",
    name: "Club Meetings 2023-24",
    description: "Weekly gatherings and special events",
    thumbnail: "/assets/images/gb-22-09-22-001-816x612.jpeg",
    images: [
      { id: "meeting-2023-1", src: "/assets/images/gb-22-09-22-001-816x612.jpeg", alt: "Club Meeting 2023-24" }
      // Add more 2023 meeting images here
    ]
  }
];

// 2024-2025 Events
export const events2024: Event[] = [
  {
    id: "installation-ceremony-2024",
    name: "Installation Ceremony 2024-25",
    description: "Installation of the new board for 2024-2025",
    thumbnail: "/assets/images/29cce85f-3867-4dff-b9d0-00549b5eef17-1-1280x853.jpg",
    images: [
      { id: "install-2024-1", src: "/assets/images/29cce85f-3867-4dff-b9d0-00549b5eef17-1-1280x853.jpg", alt: "Installation Ceremony 2024-25" },
      { id: "install-2024-2", src: "/assets/images/29cce85f-3867-4dff-b9d0-00549b5eef17-1280x853.jpg", alt: "Installation Ceremony 2024-25" }
      // Add more 2024 installation images here
    ]
  }
];

// Helper function to get events by year
export const getEventsByYear = (year: string): Event[] => {
  switch (year) {
    case "2022-2023":
      return events2022;
    case "2023-2024":
      return events2023;
    case "2024-2025":
      return events2024;
    default:
      return [];
  }
};

// Helper function to get a specific event
export const getEvent = (year: string, eventId: string): Event | undefined => {
  const events = getEventsByYear(year);
  return events.find(event => event.id === eventId);
}; 