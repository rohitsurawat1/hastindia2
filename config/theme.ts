

export const siteConfig = {
  name: "HastIndia",
  description: "Connecting Indian Artisans with Global Customers",
  url: "https://hastindia.com",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Shop",
      href: "/shop",
    },
    {
      title: "Artisans",
      href: "/artisans",
    },
    {
      title: "Stories",
      href: "/stories",
    },
  ],
  links: {
    twitter: "https://twitter.com/hastindia",
    instagram: "https://instagram.com/hastindia",
    facebook: "https://facebook.com/hastindia",
    youtube: "https://youtube.com/hastindia",
    github: "https://github.com/hastindia",
    docs: "https://hastindia.com/docs",
  },
}

export type SiteConfig = typeof siteConfig

