import { promises as fs } from 'fs';
import path from 'path';
import PostGrid from "@/components/PostGrid";

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  imageUrl?: string;
  contentHtml?: string;
}

async function getPostsIndex(): Promise<Post[]> {
  const indexPath = path.join(process.cwd(), 'public', 'posts-index.json');
  const fileContent = await fs.readFile(indexPath, 'utf8');
  return JSON.parse(fileContent);
}

export default async function Home() {
  const allPostsData = await getPostsIndex();

  // Sort all posts by date in descending order
  const sortedAllPosts = allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const otherPosts = sortedAllPosts; // All posts will be displayed in the grid below the carousel

  const imageSlides = [
    { src: "/assets/image-slides/timthumb1.png", alt: "Ardent Senyor Sto Niño Devotee & Organizer Couple receives Papal Award", text: "Ardent Senyor Sto Niño Devotee & Organizer Couple receives Papal Award\nThe Batucans have done outstanding work in the parishes of Auckland and have inspired people in faith and prayer." },
    { src: "/assets/image-slides/timthumb2.png", alt: "Contact Us", text: "Contact Us\nWe are compiling stories of prayers answered through Sto Nino devotions. Sto Nino have touched each of us and no matter how insignificant and unworthy you think it is, it will leave a lasting reminder to others. May the miracles continue and grow in us every day. Do reveal your story. We need to proclaim them." },
    { src: "/assets/image-slides/timthumb3.png", alt: "Empty Text Image 3", text: "" },
    { src: "/assets/image-slides/timthumb4.png", alt: "Installation & Blessing Chapel for Senyor Sto Nino", text: "Installation & Blessing\nChapel for Senyor Sto Nino" },
    { src: "/assets/image-slides/timthumb5.png", alt: "DEVOTION SCHEDULE", text: "DEVOTION SCHEDULE\nVenue: St. Benedicts Church, St. Benedicts St., Newton, Auckland 6:30pm Novena every Friday 7:30pm Mass of Santo Nino every 3rd Friday of the month" },
    { src: "/assets/image-slides/timthumb6.png", alt: "Empty Text Image 6", text: "" },
    { src: "/assets/image-slides/timthumb7.png", alt: "Empty Text Image 7", text: "" },
    { src: "/assets/image-slides/timthumb8.png", alt: "Spare a Gold Coin Appeal", text: "Spare a Gold Coin Appeal\nHelp us raise funds… Just one Gold Coin a day can help realize the Sto Niño Shrine project." },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Simple Carousel Test */}
      <section style={{ position: 'relative', width: '100%', height: '500px', overflow: 'hidden', marginBottom: '3rem' }}>
        <img
          src={imageSlides[0].src}
          alt={imageSlides[0].alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <div style={{ maxWidth: '48rem', color: 'white' }}>
            {imageSlides[0].text && (
              <p style={{ fontSize: '1.25rem', lineHeight: '1.75rem', marginBottom: '1.5rem', opacity: 0.9 }}>
                {imageSlides[0].text}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Other Articles Grid */}
      <section className="w-full max-w-screen-xl px-4">
        <h2 className="text-4xl font-lora font-bold text-[#2B1E1A] mb-8 text-center">Latest Articles</h2>
        <PostGrid initialPosts={otherPosts} />
      </section>
    </main>
  );
}
