import { Facebook, Instagram, Linkedin, Globe, Youtube, Twitter } from "lucide-react";

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
  showLabels?: boolean;
}

const SocialLinks = ({ className = "", iconSize = 20, showLabels = false }: SocialLinksProps) => {
  const socialLinks = [
    {
      name: "Site Web",
      icon: Globe,
      url: "https://aia-ci.org",
      color: "hover:text-blue-600"
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/Association.Ivoirienne.Astronomie",
      color: "hover:text-blue-600"
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/aia_cote_ivoire",
      color: "hover:text-pink-600"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/company/aia-cote-ivoire",
      color: "hover:text-blue-700"
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/@AIA-CoteIvoire",
      color: "hover:text-red-600"
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/AIA_CoteIvoire",
      color: "hover:text-blue-400"
    }
  ];

  return (
    <div className={`flex ${showLabels ? 'flex-col space-y-3' : 'space-x-4'} ${className}`}>
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center transition-all duration-300 ${social.color} ${
              showLabels ? 'space-x-3' : ''
            } hover:scale-110`}
            title={social.name}
          >
            <Icon size={iconSize} />
            {showLabels && <span className="text-sm">{social.name}</span>}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
