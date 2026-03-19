import { useParams } from "react-router-dom";
import { followUser, unfollowUser } from "../api/user.api";
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Zap,
} from "lucide-react";

// Mock post type
interface Post {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
    aura: "cosmic" | "earth" | "neon" | "pastel";
    vibe: number;
  };
  content: string;
  images: string[];
  timestamp: string;
  vibes: number;
  comments: number;
  echoes: number;
  vibed: boolean;
  saved: boolean;
}

const Profile = () => {
  const { id } = useParams();
  
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "echoes" | "saved">("posts");

  const [user, setUser] = useState({
    id: Number(id),
    name: "Alex Rivera",
    username: "@alexriv",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    cover: "white",
    bio: "Digital nomad • Music producer • Chasing sunsets 🌅",
    location: "Los Angeles, CA",
    website: "alexrivera.com",
    joined: "March 2023",
    aura: "cosmic" as const,
    vibe: 98,
    frequency: 85,
    followers: 1234,
    following: 567,
    postsCount: 42,
    vibesReceived: 8921,
  });

  const [userPosts] = useState<Post[]>([
    {
      id: 1,
      user: { ...user, aura: "cosmic" },
      content: "The universe whispered, and I listened. Tonight's energy is absolutely magical ✨🌙",
      images: ["https://images.unsplash.com/photo-1507525425514-594119bc2b8d?w=600"],
      timestamp: "2h ago",
      vibes: 1243,
      comments: 89,
      echoes: 23,
      vibed: false,
      saved: false,
    },
  ]);

  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return `${count}`;
  };

  const handleFollow = async () => {
    if (!id) return;
    setLoading(true);
    try {
      if (following) {
        await unfollowUser(Number(id));
        setFollowing(false);
        setUser(prev => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        await followUser(Number(id));
        setFollowing(true);
        setUser(prev => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Color constants based on your request
  const THEME = {
    bg: "bg-[#E8F5BD]",
    container: "bg-[#C5E0A3]",
    button: "bg-[#84B179]",
    buttonHover: "hover:bg-[#739c69]",
    textDark: "text-[#2D3A29]", // Dark forest green for readability
    textMuted: "text-[#4A5D45]",
  };

  return (
    <div className={`min-h-screen ${THEME.bg} transition-colors duration-1000`}>
      
      <div className="w-full px-4 sm:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left column - Sticky Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6 sticky top-8 h-fit">
            <div className={`rounded-3xl border border-[#84B179]/30 overflow-hidden shadow-sm  bg-[#C5E0A3]`}>
              <div className="h-32 bg-[#84B179]/40 relative">
                {user.cover && <img src={user.cover} alt="Cover" className="w-full h-full object-cover opacity-60" />}
              </div>
              
              <div className="relative px-6 pb-6">
                <div className="relative -mt-12 mb-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="relative h-24 w-24 rounded-2xl object-cover ring-4 ring-[#E8F5BD]"
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className={`text-2xl font-bold ${THEME.textDark}`}>{user.name}</h2>
                    <p className={`text-sm ${THEME.textMuted}`}>{user.username}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-bold text-white bg-[#84B179]">
                    vibe {user.vibe}%
                  </div>
                </div>

                <p className={`text-sm mb-4 leading-relaxed ${THEME.textDark}`}>{user.bio}</p>

                <div className={`space-y-2 text-sm ${THEME.textMuted}`}>
                  <div className="flex items-center gap-2"><MapPin size={16} /><span>{user.location}</span></div>
                  <div className="flex items-center gap-2">
                    <LinkIcon size={16} />
                    <a href="#" className="underline decoration-[#84B179]">{user.website}</a>
                  </div>
                  <div className="flex items-center gap-2"><Calendar size={16} /><span>Joined {user.joined}</span></div>
                </div>

                <div className={`mt-6 p-4 rounded-2xl border border-[#84B179]/20 bg-[#A2CB8B]`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs uppercase tracking-wider font-bold ${THEME.textMuted}`}>Frequency</span>
                    <span className={`text-sm font-mono ${THEME.textDark}`}>{user.frequency} Hz</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E8F5BD] rounded-full overflow-hidden">
                    <div className="h-full bg-[#84B179]" style={{ width: `${user.frequency}%` }} />
                  </div>
                </div>

                <button
                  onClick={handleFollow}
                  disabled={loading}
                  className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-sm ${THEME.button} ${THEME.buttonHover}`}
                >
                  {following ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>

            {/* Stats card */}
            <div className={`rounded-3xl p-6 border border-[#84B179]/30 shadow-sm ${THEME.container}`}>
              <h3 className={`font-bold mb-4 flex items-center gap-2 ${THEME.textDark}`}>
                <Zap size={18} /> Vibe Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Followers", val: user.followers },
                  { label: "Following", val: user.following },
                  { label: "Posts", val: user.postsCount },
                  { label: "Vibes", val: user.vibesReceived },
                ].map((s) => (
                  <div key={s.label} className={`p-3 rounded-2xl bg-[#A2CB8B] text-center border border-[#84B179]/10`}>
                    <div className={`text-xl font-bold ${THEME.textDark}`}>{formatCount(s.val)}</div>
                    <div className={`text-[10px] uppercase font-bold ${THEME.textMuted}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Right column - Content Area */}
          <main className="lg:col-span-8 xl:col-span-6 space-y-6">
            <div className={`rounded-2xl border border-[#84B179]/30 p-1.5 flex gap-1 shadow-sm ${THEME.container}`}>
              {["posts", "echoes", "saved"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                    activeTab === tab 
                    ? `${THEME.button} text-white shadow-md` 
                    : `${THEME.textDark} hover:bg-[#E8F5BD]/40`
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {activeTab === "posts" ? userPosts.map((post) => (
                <article key={post.id} className={`rounded-3xl border border-[#84B179]/30 overflow-hidden shadow-sm ${THEME.container}`}>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={post.user.avatar} className="h-10 w-10 rounded-xl object-cover ring-1 ring-[#84B179]/20" />
                      <div>
                        <div className={`font-bold text-sm ${THEME.textDark}`}>{post.user.name}</div>
                        <div className={`text-xs ${THEME.textMuted}`}>{post.timestamp}</div>
                      </div>
                    </div>
                    <p className={`text-base mb-4 leading-relaxed ${THEME.textDark}`}>{post.content}</p>
                    {post.images.length > 0 && (
                      <img src={post.images[0]} className="w-full h-80 object-cover rounded-2xl border border-[#84B179]/20 shadow-inner" />
                    )}
                    <div className="flex items-center gap-6 mt-6 pt-4 border-t border-[#84B179]/20">
                      <button className={`flex items-center gap-2 ${THEME.textMuted} hover:text-red-600 transition-colors`}>
                        <Heart size={18} /> <span className="text-xs font-bold">{formatCount(post.vibes)}</span>
                      </button>
                      <button className={`flex items-center gap-2 ${THEME.textMuted} hover:text-green-800 transition-colors`}>
                        <MessageCircle size={18} /> <span className="text-xs font-bold">{formatCount(post.comments)}</span>
                      </button>
                      <button className={`flex items-center gap-2 ${THEME.textMuted} hover:text-blue-800 transition-colors`}>
                        <Share2 size={18} /> <span className="text-xs font-bold">{formatCount(post.echoes)}</span>
                      </button>
                    </div>
                  </div>
                </article>
              )) : (
                <div className={`text-center py-20 rounded-3xl border border-dashed border-[#84B179]/50 ${THEME.textMuted}`}>
                  No {activeTab} available yet.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;