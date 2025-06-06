# FALAR

[https://falarapp.vercel.app](https://falarapp.vercel.app)

![alt text](https://github.com/invincibleinventor/falarapp/blob/main/mockup.png?raw=true)

Falar is an open source social networking platform that has (almost) all the features in a modern social network. Inspired by X (formerly Twitter). Very Work-In-Progress. Uses NextJS and TailwindCSS for the frontend and Supabase as a serverless backend.

### Features

- Persistent Sign In Through Google OAuth
- CRUD operations - Create, Read, Update and Delete posts.
- Like, reply and bookmark posts and like and reply to other replies
- Full markdown support for creating posts
- Block and report users.
- Delete and Deactivate account.
- User Profiles
- Follow and Unfollow users
- Feed based on following and random content
- Hashtags and mention other users (@ mentions)
- Trending tab that shows the top hashtags for the past 3 hours
- Quickies - Short form posts much like tweets
- Clicks - Photos that delete after 24 hours (like Instagram stories)
- Notification System
- and much more...

### Tech Stack

- NextJS + TailwindCSS for frontend
- React-Markdown to render Markdown
- MDXEditor for Markdown Editor component
- Supabase as a serverless backend
- Google OAuth for Google Sign In

### Note (NextJS 13+)

- The project utilizes NextJS 13+ (Server Actions)
- Client and Server components are seperated in proper bounds. Intensive tasks are loaded through the server and interactivity is done through client components
- This project therefore demands a good knowledge on NextJS 13 Server Actions & Client Components

### Future Updates

- Extend the notification system
- Ability to direct message other users
- Content recommendation through OpenAI
