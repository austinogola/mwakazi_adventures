import React from 'react';
import styled from 'styled-components';
import Navbar  from '../components/Navbar';
import ResponsiveFooter from '../components/ResponsiveFooter';

// Styled components
const BlogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

const BlogCard = styled.div`
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s;
  &:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
`;

const Content = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const Info = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #F6A214;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
`;

const blogs = [
    {
      id: 1,
      title: 'Malindi Day Trip: Discovering Kenya’s Coastal Charm',
      summary: 'A relaxing day trip to Malindi, featuring beach walks, snorkeling, and exploring historical sites.',
      description: `
  Malindi is a coastal gem that offers the perfect day trip for anyone looking to escape the hustle and bustle of city life. As soon as I stepped onto the sandy shores, I knew it was going to be a good day. The warm breeze and the sound of waves crashing on the shore immediately put me at ease. We began our adventure by exploring the ancient Gede Ruins, a centuries-old Swahili settlement hidden within the coastal forest. The ruins are steeped in history, and as I wandered through the stone buildings and paths, I couldn't help but imagine the stories of the people who lived there long ago. It was a humbling experience to see such a rich history preserved in nature.
  
  After our historical tour, we made our way to Malindi Beach for a much-anticipated snorkeling session. The ocean was crystal clear, revealing a vibrant underwater world filled with colorful coral reefs and schools of fish. I had never seen such an array of marine life up close – it felt like stepping into a different world entirely. Swimming through the coral gardens was a magical experience, and I was mesmerized by the beauty and tranquility of the ocean.
  
  We wrapped up our day by indulging in a seafood feast at a local restaurant by the shore. The fresh catch of the day, grilled to perfection, was the perfect way to end an already amazing trip. As the sun began to set over the horizon, I reflected on how rejuvenating the day had been. Malindi is the ideal destination for anyone seeking relaxation, natural beauty, and a touch of history.
      `,
      location: 'Malindi, Kenya',
      duration: '1 day',
      activities: ['Beach walks', 'Historical sites', 'Snorkeling', 'Seafood dining'],
    },
    {
      id: 2,
      title: 'Kijabe Hills Hike: Conquering the Untamed Trails',
      summary: 'A challenging one-day hike through Kijabe Hills, offering breathtaking views of the Rift Valley.',
      description: `
  The Kijabe Hills Hike is an unforgettable experience that pushes your limits and rewards you with incredible views. Just an hour’s drive from Nairobi, this hike is perfect for adventurers looking to reconnect with nature. The trail begins with a gradual ascent through a lush forest filled with the sounds of birds and rustling leaves. It’s a serene start, but soon the trail steepens, and the challenge begins.
  
  As we climbed higher, the dense trees gave way to open vistas, and the beauty of the Great Rift Valley stretched out before us. The air became cooler, fresher, as we made our way up the rugged hills. Each step brought a new perspective of the valley, and I couldn't help but stop to take photos at every turn. The views were nothing short of spectacular, with the horizon seeming to stretch out forever.
  
  The summit, though challenging to reach, was the highlight of the trip. From the top, we could see miles of untouched landscape – the perfect reward for a strenuous hike. After a quick break and some snacks, we began our descent, which was just as demanding but filled with a sense of accomplishment. Kijabe Hills offers an incredible way to escape the city and immerse yourself in the raw beauty of Kenya's landscape.
      `,
      location: 'Kijabe Hills, Kenya',
      duration: '1 day (6-7 hours)',
      activities: ['Hiking', 'Bird watching', 'Scenic views', 'Photography', 'Exploring the Rift Valley'],
    },
    {
      id: 3,
      title: 'Burudani Adventure Park: A Day of Fun for the Whole Family',
      summary: 'An action-packed day at Burudani Adventure Park with zip-lining, archery, and swimming for all ages.',
      description: `
  Burudani Adventure Park is a hidden gem that offers a day filled with excitement for the whole family. Located just outside Nairobi, it’s the perfect spot for anyone seeking a blend of thrill and relaxation. As soon as we arrived, we were greeted by the sounds of laughter and the sight of adventurous activities all around. The first thing that caught my eye was the zip line – and despite a slight fear of heights, I knew I had to try it.
  
  Strapped into the harness, I nervously took off, but once I was soaring through the air, all fear melted away. The wind rushing past, the view from above – it was exhilarating! After the zip line, we moved on to archery. Channeling my inner Robin Hood, I took aim and managed to hit the target a few times. It was a fun and challenging activity, and we all enjoyed cheering each other on.
  
  In the afternoon, we cooled off by the pool, letting the kids splash around while the adults relaxed on the loungers. The park also has plenty of open space for picnics and games, so we brought out a frisbee and had a great time in the sunshine. By the end of the day, we were all pleasantly exhausted but with smiles on our faces. Burudani Adventure Park is the ideal destination for families looking to spend quality time together in an outdoor setting.
      `,
      location: 'Burudani Adventure Park, Kiambu, Kenya',
      duration: '1 day',
      activities: ['Zip-lining', 'Archery', 'Swimming', 'Team-building games', 'Picnics'],
    },
    {
      id: 4,
      title: 'Epic Road to South Africa: The Ultimate Overland Adventure',
      summary: 'A 14-day road trip across multiple countries, offering unforgettable experiences in Africa.',
      description: `
  The Epic Road to South Africa is more than just a trip – it’s a journey of a lifetime. Over the course of two weeks, we traveled through Kenya, Tanzania, Zambia, Zimbabwe, and finally arrived in South Africa. Each day brought new landscapes, cultures, and adventures. Starting in Nairobi, we packed our 4x4s and set off on a journey that would take us across some of Africa’s most iconic locations.
  
  Tanzania greeted us with the vast plains of the Serengeti, where we witnessed a magnificent sunset over the savannah. Zambia offered us the stunning Victoria Falls, where we took a dip in the Devil's Pool, right on the edge of the waterfall. It was one of the most exhilarating experiences of my life – the roar of the water combined with the beauty of the falls made it unforgettable.
  
  Zimbabwe was a mix of history and nature, and we spent our nights around the campfire, sharing stories under the stars. Finally, we reached South Africa, where we were greeted by the iconic Table Mountain in Cape Town. Throughout the journey, we met so many incredible people, from fellow travelers to locals who shared their cultures and stories. It was an epic adventure that allowed us to experience Africa in a way that few get to. The memories from this trip will stay with me forever.
      `,
      location: 'Multi-country: Kenya, Tanzania, Zambia, Zimbabwe, South Africa',
      duration: '14 days',
      activities: ['Road trip', 'Camping', 'Sightseeing', 'Cultural experiences', 'Victoria Falls swim'],
    },
    {
      id: 5,
      title: 'Maasai Mara Safari: A Journey Into the Wild',
      summary: 'A 3-day safari in the Maasai Mara filled with game drives, a hot air balloon ride, and cultural visits.',
      description: `
  The Maasai Mara Safari was an experience that surpassed all my expectations. For three days, we were immersed in the wild, witnessing some of the most iconic wildlife moments you could imagine. We stayed in a luxurious tented camp that was just steps away from the wildlife. Each morning, we were woken up by the sounds of the savannah – lions roaring, birds chirping, and the distant rumble of wildebeest hooves.
  
  On our first game drive, we were lucky enough to witness the Great Migration. Thousands of wildebeest and zebras crossed the Mara River, dodging crocodiles as they made their way to greener pastures. It was like watching a scene from a nature documentary come to life. We also spotted the Big Five – lions, leopards, elephants, buffalo, and rhinos – all in their natural habitat.
  
  One of the highlights of the trip was the hot air balloon safari. Floating above the Mara plains at sunrise, with herds of animals below, was a truly magical experience. We ended the trip by visiting a Maasai village, where we learned about their culture and way of life. The Maasai people were warm and welcoming, and it was fascinating to see how they live in harmony with nature. The Maasai Mara is a must-visit for anyone seeking a true wildlife adventure.
      `,
      location: 'Maasai Mara National Reserve, Kenya',
      duration: '3 days',
      activities: ['Game drives', 'Hot air balloon safari', 'Cultural visits', 'Wildlife viewing', 'Luxury camping'],
    },
    // Continue with the remaining trips...
  ];
  
const BlogPosts = () => {
  return (
    <div>
        <Navbar/>
        <BlogContainer>
      {blogs.map(blog => (
        <BlogCard key={blog.id}>
          <Image src={blog.imageUrl} alt="Blog Post" />
          <Content>
            <Title>{blog.title}</Title>
            <Info>Author: {blog.author} | Date: {blog.date}</Info>
            <p>{blog.summary}</p>
            <Button>Read More</Button>
          </Content>
        </BlogCard>
      ))}
    </BlogContainer>
    <ResponsiveFooter/>
    </div>
    
  );
};

export default BlogPosts;
