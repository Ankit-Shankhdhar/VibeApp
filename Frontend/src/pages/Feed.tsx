import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	Heart,
	MessageCircle,
	Share2,
	MoreHorizontal,
	Bookmark,
	ChevronLeft,
	ChevronRight,
	Sparkles,
	TrendingUp,
	Users,
	Hash,
	Music,
	Video,
	Camera,
	MapPin,
	Mic,
	Smile,
	Sun,
	Moon,
	Zap,
	Wind,
	Compass,
	Radio,
	Disc,
	Menu,
	X,
} from "lucide-react";

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
	location?: string;
	mood?: string;
	tags: string[];
}

const VibeFeed: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([
		{
			id: 1,
			user: {
				name: "Luna Eclipse",
				username: "@luna.eco",
				avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
				aura: "cosmic",
				vibe: 98,
			},
			content: "The universe whispered, and I listened. Tonight's energy is absolutely magical ✨🌙",
			images: [
				"https://images.unsplash.com/photo-1507525425514-594119bc2b8d?w=600",
				"https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=600",
				"https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600",
			],
			timestamp: "2h ago",
			vibes: 1243,
			comments: 89,
			echoes: 23,
			vibed: false,
			saved: false,
			location: "Sedona, AZ",
			mood: "ethereal",
			tags: ["#cosmic", "#manifestation", "#fullmoon"],
		},
		{
			id: 2,
			user: {
				name: "Kai Flow",
				username: "@kai.flow",
				avatar: "https://images.unsplash.com/photo-1494790108777-385ef6eebf3e?w=150",
				aura: "neon",
				vibe: 100,
			},
			content: "New beat dropping at midnight. This one's for the late night dreamers 🎧✨",
			images: [
				"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600",
				"https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600",
			],
			timestamp: "5h ago",
			vibes: 2341,
			comments: 156,
			echoes: 67,
			vibed: true,
			saved: false,
			location: "Studio 54",
			mood: "electric",
			tags: ["#beats", "#midnightvibes", "#music"],
		},
		{
			id: 3,
			user: {
				name: "Willow Rain",
				username: "@willow.earth",
				avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
				aura: "earth",
				vibe: 95,
			},
			content: "Found this hidden waterfall today. Nature is the best healer 🌿💧",
			images: [
				"https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600",
				"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
			],
			timestamp: "1d ago",
			vibes: 892,
			comments: 42,
			echoes: 12,
			vibed: false,
			saved: true,
			location: "Blue Mountains",
			mood: "grounded",
			tags: ["#nature", "#waterfall", "#healing"],
		},
	]);

	const [currentImageIndex, setCurrentImageIndex] = useState<{
		[key: number]: number;
	}>({});
	const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day");
	const [energyFilter, setEnergyFilter] = useState<string>("all");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Check if mobile on mount and resize
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1024);
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const viewerAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150";
	const viewerName = "Alex";
	const viewerAura = "cosmic";

	const formatCount = (count: number) => {
		if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
		if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
		return `${count}`;
	};

	// Solid earthy colors for auras (no gradients)
	const getAuraColors = (aura: string) => {
		switch (aura) {
			case "cosmic":
				return {
					bg: "bg-[#E8F5BD]",
					text: "text-[#2C4A2B]",
					border: "border-[#84B179]",
				};
			case "neon":
				return {
					bg: "bg-[#A2CB8B]",
					text: "text-[#1A2F1A]",
					border: "border-[#2C4A2B]",
				};
			case "earth":
				return {
					bg: "bg-[#84B179]",
					text: "text-[#1A2F1A]",
					border: "border-[#1A2F1A]",
				};
			case "pastel":
				return {
					bg: "bg-[#E8F5BD]",
					text: "text-[#2C4A2B]",
					border: "border-[#84B179]",
				};
			default:
				return {
					bg: "bg-[#E8F5BD]",
					text: "text-[#2C4A2B]",
					border: "border-[#84B179]",
				};
		}
	};

	const handleVibe = (postId: number) => {
		setPosts((prev) =>
			prev.map((post) =>
				post.id === postId
					? {
							...post,
							vibed: !post.vibed,
							vibes: post.vibed ? post.vibes - 1 : post.vibes + 1,
					  }
					: post
			)
		);
	};

	const handleEcho = (postId: number) => {
		setPosts((prev) =>
			prev.map((post) =>
				post.id === postId
					? { ...post, echoes: post.echoes + 1 }
					: post
			)
		);
	};

	const nextImage = (postId: number, totalImages: number) => {
		setCurrentImageIndex((prev) => ({
			...prev,
			[postId]: ((prev[postId] || 0) + 1) % totalImages,
		}));
	};

	const prevImage = (postId: number, totalImages: number) => {
		setCurrentImageIndex((prev) => ({
			...prev,
			[postId]: ((prev[postId] || 0) - 1 + totalImages) % totalImages,
		}));
	};

	const energyLevels = ["all", "cosmic", "neon", "earth", "pastel"];

	// Card styles based on theme (solid earthy colors)
	const getCardStyles = (isLight: boolean) => {
		return {
			card: isLight 
				? "bg-[#2C4A2B] border-[#84B179] text-white" 
				: "bg-[#E8F5BD] border-[#84B179] text-[#1A2F1A]",
			cardHover: isLight 
				? "hover:bg-[#1A2F1A]" 
				: "hover:bg-[#A2CB8B]",
			text: isLight ? "text-[#E8F5BD]" : "text-[#2C4A2B]",
			textStrong: isLight ? "text-white" : "text-[#1A2F1A]",
			textMuted: isLight ? "text-[#A2CB8B]" : "text-[#84B179]",
			input: isLight 
				? "bg-[#1A2F1A] border-[#84B179] text-[#E8F5BD] placeholder:text-[#A2CB8B]" 
				: "bg-[#A2CB8B] border-[#84B179] text-[#1A2F1A] placeholder:text-[#2C4A2B]",
			border: "border-[#84B179]",
			button: isLight 
				? "hover:bg-[#1A2F1A] text-[#E8F5BD]" 
				: "hover:bg-[#A2CB8B] text-[#2C4A2B]",
		};
	};

	const cardStyles = getCardStyles(timeOfDay === "night");

	return (
		<div className={`h-screen flex flex-col transition-colors duration-1000 scroll-none ${
			timeOfDay === "night" 
				? "bg-[#1A2F1A]" 
				: "bg-[#E8F5BD]"
		}`}>
			{/* Animated Background Particles - hidden on mobile for performance */}
			{/* {!isMobile && (
				<div className="fixed inset-0 pointer-events-none overflow-hidden">
					{[...Array(20)].map((_, i) => (
						<div
							key={i}
							className={`absolute rounded-full mix-blend-screen animate-pulse ${
								timeOfDay === "night" ? "bg-[#84B179]/10" : "bg-[#A2CB8B]/10"
							}`}
							style={{
								width: `${Math.random() * 300 + 50}px`,
								height: `${Math.random() * 300 + 50}px`,
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
								animationDelay: `${Math.random() * 5}s`,
								animationDuration: `${Math.random() * 10 + 10}s`,
							}}
						/>
					))}
				</div>
			)} */}
			
			{/* Header with theme toggle */}

			{/* Main Layout - Fixed height with scrolling middle */}
			<div className="flex-1 overflow-hidden">
				<div className="h-full mx-auto max-full px-4 sm:px-6 py-4 sm:py-8">
					{/* Updated grid: left 2, center 8, right 2 */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-6 h-full">
						
						{/* Left Sidebar - narrower (col-span-2) */}
						<aside className="hidden lg:block lg:col-span-2 h-full overflow-y-auto scrollbar-hide">
							<div className="space-y-6 pr-2">
								<div className={`rounded-3xl p-6 border transition-colors ${
									timeOfDay === "night" 
										? "bg-[#2C4A2B] border-[#84B179]" 
										: "bg-[#E8F5BD] border-[#84B179]"
								}`}>
									<div className="flex items-center gap-3 mb-6">
										<div className={`h-12 w-12 rounded-2xl ${getAuraColors(viewerAura).bg} flex items-center justify-center`}>
											<Sparkles className="h-6 w-6 text-[#1A2F1A]" />
										</div>
										<div>
											<div className={`font-semibold text-lg ${cardStyles.textStrong}`}>{viewerName}</div>
											<div className={`text-sm ${timeOfDay === "night" ? "text-[#A2CB8B]" : "text-[#2C4A2B]"}`}>
												your vibe: 94%
											</div>
										</div>
									</div>

									<div className="space-y-4">
										<div className={`h-2 rounded-full ${timeOfDay === "night" ? "bg-[#1A2F1A]" : "bg-[#A2CB8B]"}`}>
											<div className="w-3/4 h-2 rounded-full bg-[#84B179]" />
										</div>

										<div className="grid grid-cols-2 gap-3">
											{[
												{ icon: Compass, label: "Explore", active: true },
												{ icon: Radio, label: "Live", active: false },
												{ icon: Disc, label: "Sounds", active: false },
												{ icon: Users, label: "Circle", active: false },
											].map((item) => (
												<button
													key={item.label}
													className={`p-3 rounded-xl transition-all ${
														item.active
															? `bg-[#84B179] text-[#1A2F1A]`
															: timeOfDay === "night"
															? "hover:bg-[#1A2F1A] text-[#E8F5BD]"
															: "hover:bg-[#A2CB8B] text-[#2C4A2B]"
													}`}
												>
													<item.icon className="h-5 w-5 mx-auto mb-1" />
													<span className="text-xs">{item.label}</span>
												</button>
											))}
										</div>
									</div>
								</div>

								<div className={`rounded-3xl p-6 border transition-colors ${
									timeOfDay === "night" 
										? "bg-[#2C4A2B] border-[#84B179]" 
										: "bg-[#E8F5BD] border-[#84B179]"
								}`}>
									<h3 className={`font-semibold mb-4 flex items-center gap-2 ${cardStyles.textStrong}`}>
										<TrendingUp className="h-4 w-4" />
										Rising vibes
									</h3>
									<div className="space-y-4">
										{[1, 2, 3, 4].map((i) => (
											<div key={i} className="flex items-center gap-3">
												<div className={`w-10 h-10 rounded-xl ${getAuraColors(["cosmic", "neon", "earth", "pastel"][i-1]).bg}`} />
												<div className="flex-1">
													<div className={`font-medium ${cardStyles.textStrong}`}>@creator{i}</div>
													<div className={`text-xs ${timeOfDay === "night" ? "text-[#A2CB8B]" : "text-[#2C4A2B]"}`}>
														+{Math.floor(Math.random() * 1000)} vibes
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</aside>

						{/* Main Feed - larger center (col-span-8) */}
						<main className="lg:col-span-8 h-full overflow-y-auto scrollbar-hide px-1 sm:px-2">
							<div className="space-y-4 sm:space-y-6 pb-4">
								{/* Create Post - Floating Energy Input */}
								<div className={`relative group rounded-2xl sm:rounded-3xl border transition-all duration-500 ${
									timeOfDay === "night" 
										? "bg-[#2C4A2B] border-[#84B179]" 
										: "bg-[#E8F5BD] border-[#84B179]"
								}`}>
									<div className="relative p-3 sm:p-5">
										<div className="flex items-center gap-2 sm:gap-4">
											<img
												src={viewerAvatar}
												alt="Your avatar"
												className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl object-cover ring-2 ring-[#84B179]"
											/>
											<input
												type="text"
												placeholder="Share your current frequency..."
												className={`flex-1 bg-transparent border-none text-sm sm:text-lg ${
													timeOfDay === "night" ? "placeholder:text-[#A2CB8B] text-white" : "placeholder:text-[#84B179] text-[#1A2F1A]"
												} focus:outline-none`}
											/>
											<button className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[#84B179] text-[#1A2F1A] transition-transform hover:scale-110`}>
												<Zap className="h-4 w-4 sm:h-5 sm:w-5" />
											</button>
										</div>

										<div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#84B179]">
											<Link to="/chat" className="chat-button">
        Go to Chat
      </Link>
											{[Camera, Mic, MapPin, Smile].map((Icon, i) => (
												<button
													key={i}
													className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all hover:scale-110 ${
														timeOfDay === "night" 
															? "hover:bg-[#1A2F1A] text-[#E8F5BD]" 
															: "hover:bg-[#A2CB8B] text-[#2C4A2B]"
													}`}
												>
													<Icon className="h-4 w-4 sm:h-5 sm:w-5" />
												</button>
											))}
										</div>
									</div>
								</div>

								{/* Posts */}
								{posts.map((post) => {
									const auraColors = getAuraColors(post.user.aura);
									const currentIdx = currentImageIndex[post.id] || 0;
									const totalImages = post.images.length;

									return (
										<article
											key={post.id}
											className={`relative group rounded-2xl sm:rounded-3xl border transition-all duration-500 ${cardStyles.card} ${auraColors.border}`}
										>
											{/* Post Header */}
											<div className="relative p-4 sm:p-6">
												<div className="flex items-start justify-between">
													<div className="flex items-center gap-3 sm:gap-4">
														<div className="relative">
															<img
																src={post.user.avatar}
																alt={post.user.name}
																className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl object-cover ring-2 ring-[#84B179]"
															/>
														</div>
														<div>
															<div className="flex items-center gap-2">
																<h3 className={`font-semibold text-sm sm:text-lg ${cardStyles.textStrong}`}>
																	{post.user.name}
																</h3>
																<div className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${auraColors.bg} text-[#1A2F1A]`}>
																	vibe {post.user.vibe}%
																</div>
															</div>
															<div className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${cardStyles.text}`}>
																<span>{post.user.username}</span>
																<span>·</span>
																<span>{post.timestamp}</span>
																{post.location && (
																	<>
																		<span className="hidden xs:inline">·</span>
																		<MapPin className="h-3 w-3 hidden xs:block" />
																		<span className="hidden xs:inline">{post.location}</span>
																	</>
																)}
															</div>
														</div>
													</div>

													<button className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors ${cardStyles.button}`}>
														<MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
													</button>
												</div>

												{/* Mood Indicator */}
												{post.mood && (
													<div className="mt-2 sm:mt-3 inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#E8F5BD]/30">
														<Wind className={`h-3 w-3 sm:h-4 sm:w-4 ${auraColors.text}`} />
														<span className={`text-xs sm:text-sm capitalize ${auraColors.text}`}>
															feeling {post.mood}
														</span>
													</div>
												)}

												{/* Content */}
												<p className={`mt-3 sm:mt-4 text-sm sm:text-lg leading-relaxed ${cardStyles.textStrong}`}>
													{post.content}
												</p>

												{/* Tags */}
												<div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
													{post.tags.map((tag) => (
														<span
															key={tag}
															className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${auraColors.text} ${
																timeOfDay === "night" ? "bg-[#1A2F1A]" : "bg-[#E8F5BD]"
															}`}
														>
															{tag}
														</span>
													))}
												</div>

												{/* Images */}
												{post.images.length > 0 && (
													<div className="mt-3 sm:mt-4 relative">
														<div className={`relative rounded-xl sm:rounded-2xl overflow-hidden ${
															totalImages === 1 ? "max-h-[300px] sm:max-h-[500px]" : "aspect-video"
														}`}>
															<img
																src={post.images[currentIdx]}
																alt={`Post ${currentIdx + 1}`}
																className="w-full h-full object-cover"
															/>

															{totalImages > 1 && (
																<>
																	<button
																		onClick={() => prevImage(post.id, totalImages)}
																		className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-1.5 sm:p-2 rounded-full text-white hover:bg-black/70 transition-all hover:scale-110"
																	>
																		<ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
																	</button>

																	<button
																		onClick={() => nextImage(post.id, totalImages)}
																		className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-1.5 sm:p-2 rounded-full text-white hover:bg-black/70 transition-all hover:scale-110"
																	>
																		<ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
																	</button>

																	<div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
																		{Array.from({ length: totalImages }).map((_, idx) => (
																			<button
																				key={idx}
																				onClick={() =>
																					setCurrentImageIndex((prev) => ({
																						...prev,
																						[post.id]: idx,
																					}))
																				}
																				className={`h-1 sm:h-1.5 rounded-full transition-all ${
																					idx === currentIdx
																						? `w-4 sm:w-6 bg-[#84B179]`
																						: "w-1 sm:w-1.5 bg-white/50 hover:bg-white/80"
																				}`}
																			/>
																		))}
																	</div>

																	<div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
																		{currentIdx + 1}/{totalImages}
																	</div>
																</>
															)}
														</div>
													</div>
												)}

												{/* Engagement Stats */}
												<div className="mt-3 sm:mt-4 flex items-center justify-between">
													<div className="flex items-center gap-1 sm:gap-2">
														<div className={`flex items-center -space-x-2`}>
															<div className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full ${auraColors.bg} flex items-center justify-center`}>
																<Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#1A2F1A]" />
															</div>
														</div>
														<span className={`text-xs sm:text-sm ${auraColors.text}`}>
															{formatCount(post.vibes)} vibes
														</span>
													</div>
													<div className={`flex gap-2 sm:gap-4 text-xs sm:text-sm ${cardStyles.textMuted}`}>
														<span>{formatCount(post.comments)} echoes</span>
														<span>{formatCount(post.echoes)} shares</span>
													</div>
												</div>

												{/* Action Buttons */}
												<div className="mt-3 sm:mt-4 grid grid-cols-4 gap-1 sm:gap-2">
													<button
														onClick={() => handleVibe(post.id)}
														className={`flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all hover:scale-105 ${
															post.vibed
																? `${auraColors.bg} text-[#1A2F1A]`
																: cardStyles.button
														}`}
													>
														<Zap className={`h-3 w-3 sm:h-5 sm:w-5 ${post.vibed ? "fill-[#1A2F1A]" : ""}`} />
														<span className="text-xs sm:text-sm font-medium">Vibe</span>
													</button>

													<button className={`flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all hover:scale-105 ${cardStyles.button}`}>
														<MessageCircle className="h-3 w-3 sm:h-5 sm:w-5" />
														<span className="text-xs sm:text-sm font-medium">Echo</span>
													</button>

													<button
														onClick={() => handleEcho(post.id)}
														className={`flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all hover:scale-105 ${cardStyles.button}`}
													>
														<Share2 className="h-3 w-3 sm:h-5 sm:w-5" />
														<span className="text-xs sm:text-sm font-medium">Share</span>
													</button>

													<button
														onClick={() => {}}
														className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all hover:scale-105 ${
															post.saved
																? `${auraColors.bg} text-[#1A2F1A]`
																: cardStyles.button
														}`}
													>
														<Bookmark className={`h-3 w-3 sm:h-5 sm:w-5 ${post.saved ? "fill-[#1A2F1A]" : ""}`} />
													</button>
												</div>

												{/* Comment Input */}
												<div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3">
													<img
														src={viewerAvatar}
														alt="Your avatar"
														className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl object-cover"
													/>
													<input
														type="text"
														placeholder="Add to the frequency..."
														className={`flex-1 bg-transparent border-b text-xs sm:text-sm py-1 sm:py-2 ${
															timeOfDay === "night" 
																? "border-[#84B179] text-[#E8F5BD] placeholder:text-[#A2CB8B]" 
																: "border-[#84B179] text-[#1A2F1A] placeholder:text-[#2C4A2B]"
														} focus:outline-none focus:border-[#E8F5BD] transition-colors`}
													/>
												</div>
											</div>
										</article>
									);
								})}
							</div>
						</main>

						{/* Right Sidebar - narrower (col-span-2) */}
						<aside className="hidden lg:block lg:col-span-2 h-full overflow-y-auto scrollbar-hide">
							<div className="space-y-6 pl-2">
								<div className={`rounded-3xl p-6 border transition-colors ${
									timeOfDay === "night" 
										? "bg-[#2C4A2B] border-[#84B179]" 
										: "bg-[#E8F5BD] border-[#84B179]"
								}`}>
									<h3 className={`font-semibold mb-4 flex items-center gap-2 ${cardStyles.textStrong}`}>
										<Radio className="h-4 w-4" />
										Live frequencies
									</h3>
									<div className="space-y-4">
										{[1, 2, 3].map((i) => (
											<div key={i} className="flex items-center gap-3">
												<div className="relative">
													<div className="absolute inset-0 bg-[#84B179] rounded-full animate-ping opacity-75" />
													<div className="relative h-2 w-2 bg-[#84B179] rounded-full" />
												</div>
												<div className="flex-1">
													<div className={`font-medium ${cardStyles.textStrong}`}>Creator {i}</div>
													<div className={`text-xs ${timeOfDay === "night" ? "text-[#A2CB8B]" : "text-[#2C4A2B]"}`}>
														streaming now
													</div>
												</div>
												<button className={`px-3 py-1 rounded-full text-xs font-medium ${getAuraColors("cosmic").bg} text-[#1A2F1A]`}>
													Tune in
												</button>
											</div>
										))}
									</div>
								</div>

								<div className={`rounded-3xl p-6 border transition-colors ${
									timeOfDay === "night" 
										? "bg-[#2C4A2B] border-[#84B179]" 
										: "bg-[#E8F5BD] border-[#84B179]"
								}`}>
									<h3 className={`font-semibold mb-4 flex items-center gap-2 ${cardStyles.textStrong}`}>
										<Hash className="h-4 w-4" />
										Trending frequencies
									</h3>
									<div className="space-y-3">
										{["#cosmic", "#healing", "#beats", "#nature", "#dreams"].map((tag) => (
											<div key={tag} className="flex items-center justify-between">
												<span className="text-[#84B179] hover:text-[#A2CB8B] cursor-pointer">{tag}</span>
												<span className={`text-xs ${timeOfDay === "night" ? "text-[#A2CB8B]" : "text-[#2C4A2B]"}`}>
													{Math.floor(Math.random() * 10 + 1)}k vibes
												</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>

			{/* Mobile Bottom Navigation */}
			<div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-[#84B179] bg-[#2C4A2B]">
				<div className="flex items-center justify-around py-2">
					{[
						{ icon: Compass, label: "Explore", active: true },
						{ icon: Radio, label: "Live", active: false },
						{ icon: Disc, label: "Sounds", active: false },
						{ icon: Users, label: "Circle", active: false },
					].map((item) => (
						<button
							key={item.label}
							className={`p-2 rounded-xl transition-all ${
								item.active
									? "bg-[#84B179] text-[#1A2F1A]"
									: "text-[#E8F5BD] hover:text-[#A2CB8B]"
							}`}
						>
							<item.icon className="h-5 w-5" />
						</button>
					))}
				</div>
			</div>

			<style>{`
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
				.scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>
		</div>
	);
};

export default VibeFeed;