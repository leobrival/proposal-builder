import { cn } from "../../../lib/utils";
import type { ContactSettings, Section } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface ContactSectionProps {
	section: Section;
}

export function ContactSection({ section }: ContactSectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as ContactSettings;
	const { colors, typography } = layout.globalStyles;

	const renderForm = () => (
		<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
			{settings.formFields?.includes("name") && (
				<div>
					<label
						className="block text-sm font-medium mb-1"
						style={{ color: colors.text }}
					>
						Nom
					</label>
					<input
						type="text"
						placeholder="Votre nom"
						className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2"
						style={{
							color: colors.text,
							borderColor: colors.muted,
						}}
					/>
				</div>
			)}

			{settings.formFields?.includes("email") && (
				<div>
					<label
						className="block text-sm font-medium mb-1"
						style={{ color: colors.text }}
					>
						Email
					</label>
					<input
						type="email"
						placeholder="votre@email.com"
						className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2"
						style={{
							color: colors.text,
							borderColor: colors.muted,
						}}
					/>
				</div>
			)}

			{settings.formFields?.includes("company") && (
				<div>
					<label
						className="block text-sm font-medium mb-1"
						style={{ color: colors.text }}
					>
						Entreprise
					</label>
					<input
						type="text"
						placeholder="Nom de votre entreprise"
						className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2"
						style={{
							color: colors.text,
							borderColor: colors.muted,
						}}
					/>
				</div>
			)}

			{settings.formFields?.includes("phone") && (
				<div>
					<label
						className="block text-sm font-medium mb-1"
						style={{ color: colors.text }}
					>
						Telephone
					</label>
					<input
						type="tel"
						placeholder="+33 6 00 00 00 00"
						className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2"
						style={{
							color: colors.text,
							borderColor: colors.muted,
						}}
					/>
				</div>
			)}

			{settings.formFields?.includes("message") && (
				<div>
					<label
						className="block text-sm font-medium mb-1"
						style={{ color: colors.text }}
					>
						Message
					</label>
					<textarea
						rows={4}
						placeholder="Votre message..."
						className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 resize-none"
						style={{
							color: colors.text,
							borderColor: colors.muted,
						}}
					/>
				</div>
			)}

			<button
				type="submit"
				className="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors"
				style={{ backgroundColor: colors.primary }}
			>
				{settings.submitText || "Envoyer"}
			</button>
		</form>
	);

	const renderContactInfo = () => (
		<div className="space-y-6">
			{settings.showEmail && (
				<div className="flex items-start gap-4">
					<div
						className="w-10 h-10 rounded-lg flex items-center justify-center"
						style={{ backgroundColor: `${colors.primary}20` }}
					>
						<svg
							className="w-5 h-5"
							style={{ color: colors.primary }}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<div>
						<h4 className="font-medium" style={{ color: colors.text }}>
							Email
						</h4>
						<p
							className="text-sm"
							style={{ color: colors.muted }}
							contentEditable
							suppressContentEditableWarning
						>
							contact@example.com
						</p>
					</div>
				</div>
			)}

			{settings.showPhone && (
				<div className="flex items-start gap-4">
					<div
						className="w-10 h-10 rounded-lg flex items-center justify-center"
						style={{ backgroundColor: `${colors.primary}20` }}
					>
						<svg
							className="w-5 h-5"
							style={{ color: colors.primary }}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
					</div>
					<div>
						<h4 className="font-medium" style={{ color: colors.text }}>
							Telephone
						</h4>
						<p
							className="text-sm"
							style={{ color: colors.muted }}
							contentEditable
							suppressContentEditableWarning
						>
							+33 1 23 45 67 89
						</p>
					</div>
				</div>
			)}

			{settings.showAddress && (
				<div className="flex items-start gap-4">
					<div
						className="w-10 h-10 rounded-lg flex items-center justify-center"
						style={{ backgroundColor: `${colors.primary}20` }}
					>
						<svg
							className="w-5 h-5"
							style={{ color: colors.primary }}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</div>
					<div>
						<h4 className="font-medium" style={{ color: colors.text }}>
							Adresse
						</h4>
						<p
							className="text-sm"
							style={{ color: colors.muted }}
							contentEditable
							suppressContentEditableWarning
						>
							123 Rue de l'Exemple
							<br />
							75001 Paris, France
						</p>
					</div>
				</div>
			)}
		</div>
	);

	return (
		<div className="py-12">
			{/* Section title */}
			<div className="text-center mb-10">
				<h2
					className="text-3xl font-bold mb-3"
					style={{
						fontFamily: typography.headingFont,
						color: colors.primary,
					}}
					contentEditable
					suppressContentEditableWarning
				>
					Contactez-nous
				</h2>
				<p
					className="text-lg max-w-2xl mx-auto"
					style={{ color: colors.muted }}
					contentEditable
					suppressContentEditableWarning
				>
					Interesse par un partenariat ? N'hesitez pas a nous contacter
				</p>
			</div>

			{/* Content based on layout */}
			{settings.layout === "form-only" && (
				<div className="max-w-md mx-auto">{renderForm()}</div>
			)}

			{settings.layout === "info-only" && (
				<div className="max-w-md mx-auto">{renderContactInfo()}</div>
			)}

			{settings.layout === "form-info" && (
				<div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
					<div>{renderForm()}</div>
					<div>{renderContactInfo()}</div>
				</div>
			)}
		</div>
	);
}
