import { Globe, Linkedin, Twitter, User } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { Section, TeamSettings } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface TeamSectionProps {
	section: Section;
}

const defaultMembers = [
	{
		id: "1",
		name: "Marie Dupont",
		role: "Directrice Generale",
		bio: "15 ans d'experience dans l'organisation d'evenements",
		photoUrl: "",
		socials: {
			linkedin: "#",
			twitter: "#",
		},
	},
	{
		id: "2",
		name: "Jean Martin",
		role: "Responsable Partenariats",
		bio: "Expert en relations sponsors et partenaires",
		photoUrl: "",
		socials: {
			linkedin: "#",
		},
	},
	{
		id: "3",
		name: "Sophie Bernard",
		role: "Responsable Communication",
		bio: "Specialiste marketing digital et evenementiel",
		photoUrl: "",
		socials: {
			linkedin: "#",
			twitter: "#",
			website: "#",
		},
	},
	{
		id: "4",
		name: "Pierre Leroy",
		role: "Directeur Technique",
		bio: "Expert en logistique evenementielle",
		photoUrl: "",
		socials: {
			linkedin: "#",
		},
	},
];

export function TeamSection({ section }: TeamSectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as TeamSettings;
	const { colors, typography } = layout.globalStyles;

	const members =
		settings.members?.length > 0 ? settings.members : defaultMembers;
	const cols = settings.columns || 3;

	const MemberCard = ({ member }: { member: (typeof members)[0] }) => (
		<div className="text-center group">
			<div
				className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden"
				style={{ backgroundColor: colors.primary + "15" }}
			>
				{member.photoUrl ? (
					<img
						src={member.photoUrl}
						alt={member.name}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<User
							className="w-16 h-16"
							style={{ color: colors.primary + "50" }}
						/>
					</div>
				)}
			</div>

			<h3
				className="font-semibold text-lg"
				style={{ color: colors.text }}
				contentEditable
				suppressContentEditableWarning
			>
				{member.name}
			</h3>

			{settings.showRole !== false && member.role && (
				<p
					className="text-sm mb-2"
					style={{ color: colors.primary }}
					contentEditable
					suppressContentEditableWarning
				>
					{member.role}
				</p>
			)}

			{settings.showBio && member.bio && (
				<p
					className="text-sm mb-3 max-w-xs mx-auto"
					style={{ color: colors.muted }}
					contentEditable
					suppressContentEditableWarning
				>
					{member.bio}
				</p>
			)}

			{settings.showSocials !== false && member.socials && (
				<div className="flex justify-center gap-3">
					{member.socials.linkedin && (
						<a
							href={member.socials.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:opacity-70 transition-opacity"
						>
							<Linkedin className="w-5 h-5" style={{ color: colors.muted }} />
						</a>
					)}
					{member.socials.twitter && (
						<a
							href={member.socials.twitter}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:opacity-70 transition-opacity"
						>
							<Twitter className="w-5 h-5" style={{ color: colors.muted }} />
						</a>
					)}
					{member.socials.website && (
						<a
							href={member.socials.website}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:opacity-70 transition-opacity"
						>
							<Globe className="w-5 h-5" style={{ color: colors.muted }} />
						</a>
					)}
				</div>
			)}
		</div>
	);

	return (
		<div className="py-12">
			<div className="text-center mb-10">
				<h2
					className="text-2xl md:text-3xl font-bold mb-4"
					style={{
						fontFamily: typography.headingFont,
						color: colors.text,
					}}
					contentEditable
					suppressContentEditableWarning
				>
					Notre equipe
				</h2>
				<p
					className="text-lg max-w-2xl mx-auto"
					style={{ color: colors.muted }}
					contentEditable
					suppressContentEditableWarning
				>
					Les personnes passionnees qui organisent cet evenement
				</p>
			</div>

			{settings.layout === "carousel" ? (
				<div className="flex overflow-x-auto gap-8 pb-4 snap-x">
					{members.map((member) => (
						<div key={member.id} className="shrink-0 w-64 snap-center">
							<MemberCard member={member} />
						</div>
					))}
				</div>
			) : (
				<div
					className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-8`}
				>
					{members.map((member) => (
						<MemberCard key={member.id} member={member} />
					))}
				</div>
			)}
		</div>
	);
}
