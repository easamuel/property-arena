import React from "react";

interface BlogPost {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  url: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    image: "https://picsum.photos/800/600?random=6",
    title: "How to Choose Your Dream Home",
    excerpt:
      "Finding the perfect home is about knowing what you want and where you want to be. Here are some tips to help guide your search...",
    url: "/blog/how-to-choose-your-dream-home",
  },
  {
    id: 2,
    image: "https://picsum.photos/800/600?random=9",
    title: "Top Neighborhoods for Families",
    excerpt:
      "Families look for safety, schools, and parks when choosing a neighborhood. Check out these top locations ideal for raising kids...",
    url: "/blog/top-neighborhoods-for-families",
  },
  {
    id: 3,
    image: "https://picsum.photos/800/600?random=4",
    title: "Real Estate Trends 2025",
    excerpt:
      "The real estate market is ever-changing. Here's what experts predict for 2025 and how you can benefit from these trends...",
    url: "/blog/real-estate-trends-2025",
  },
];

const BlogSection: React.FC = () => {
  return (
    <section className="my-12 px-2">
      <h2 className="text-xl font-semibold mb-6">Our Blog</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogPosts.map(({ id, image, title, excerpt, url }) => (
          <div key={id} className="rounded shadow-lg overflow-hidden cursor-pointer bg-white">
            <img src={image} alt={title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-gray-700 mb-3">
                {excerpt.length > 100 ? excerpt.slice(0, 100) + "..." : excerpt}
              </p>
              <a
                href={url}
                className="text-red-600 font-semibold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
