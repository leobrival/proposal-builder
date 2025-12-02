import {
	AlertCircle,
	Check,
	CheckCircle,
	Copy,
	ExternalLink,
	Globe,
	Loader2,
	RefreshCw,
	X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type {
	DomainSettings as DomainSettingsType,
	Proposal,
} from "../../types";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

/**
 * Get CSRF token from cookie
 */
function getCsrfToken(): string {
	const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
	if (match) {
		return decodeURIComponent(match[1]);
	}
	return "";
}

interface DomainSettingsProps {
	proposal: Proposal;
	onUpdate?: () => void;
}

export function DomainSettings({ proposal, onUpdate }: DomainSettingsProps) {
	const [loading, setLoading] = useState(false);
	const [domainData, setDomainData] = useState<DomainSettingsType | null>(null);
	const [subdomain, setSubdomain] = useState("");
	const [customDomain, setCustomDomain] = useState("");
	const [subdomainError, setSubdomainError] = useState<string | null>(null);
	const [customDomainError, setCustomDomainError] = useState<string | null>(
		null,
	);
	const [verifying, setVerifying] = useState(false);
	const [copied, setCopied] = useState<string | null>(null);

	const baseDomain = "sponseasy.com"; // TODO: Get from env

	// Fetch domain settings
	const fetchDomainSettings = useCallback(async () => {
		try {
			const response = await fetch(`/proposals/${proposal.id}/domain`);
			if (response.ok) {
				const data = await response.json();
				setDomainData(data);
				setSubdomain(data.subdomain || "");
				setCustomDomain(data.customDomain || "");
			}
		} catch (error) {
			console.error("Failed to fetch domain settings:", error);
		}
	}, [proposal.id]);

	useEffect(() => {
		fetchDomainSettings();
	}, [fetchDomainSettings]);

	// Copy to clipboard
	const copyToClipboard = async (text: string, key: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(key);
			setTimeout(() => setCopied(null), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	// Check subdomain availability
	const checkSubdomainAvailability = async (value: string) => {
		if (!value || value.length < 3) return;

		try {
			const response = await fetch(
				`/domain/check-subdomain?subdomain=${encodeURIComponent(value)}&proposalId=${proposal.id}`,
			);
			const data = await response.json();
			if (!data.available) {
				setSubdomainError(data.error || "Ce sous-domaine n'est pas disponible");
			} else {
				setSubdomainError(null);
			}
		} catch (error) {
			console.error("Failed to check subdomain:", error);
		}
	};

	// Save subdomain
	const saveSubdomain = async () => {
		if (!subdomain || subdomainError) return;

		setLoading(true);
		try {
			const response = await fetch(
				`/proposals/${proposal.id}/domain/subdomain`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-XSRF-TOKEN": getCsrfToken(),
					},
					body: JSON.stringify({ subdomain }),
				},
			);

			if (response.ok) {
				await fetchDomainSettings();
				onUpdate?.();
			} else {
				const data = await response.json();
				setSubdomainError(data.error);
			}
		} catch (error) {
			console.error("Failed to save subdomain:", error);
		} finally {
			setLoading(false);
		}
	};

	// Remove subdomain
	const removeSubdomain = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`/proposals/${proposal.id}/domain/subdomain`,
				{
					method: "DELETE",
					headers: {
						"X-XSRF-TOKEN": getCsrfToken(),
					},
				},
			);

			if (response.ok) {
				setSubdomain("");
				await fetchDomainSettings();
				onUpdate?.();
			}
		} catch (error) {
			console.error("Failed to remove subdomain:", error);
		} finally {
			setLoading(false);
		}
	};

	// Save custom domain
	const saveCustomDomain = async () => {
		if (!customDomain || customDomainError) return;

		setLoading(true);
		try {
			const response = await fetch(`/proposals/${proposal.id}/domain/custom`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-XSRF-TOKEN": getCsrfToken(),
				},
				body: JSON.stringify({ customDomain }),
			});

			if (response.ok) {
				await fetchDomainSettings();
				onUpdate?.();
			} else {
				const data = await response.json();
				setCustomDomainError(data.error);
			}
		} catch (error) {
			console.error("Failed to save custom domain:", error);
		} finally {
			setLoading(false);
		}
	};

	// Remove custom domain
	const removeCustomDomain = async () => {
		setLoading(true);
		try {
			const response = await fetch(`/proposals/${proposal.id}/domain/custom`, {
				method: "DELETE",
				headers: {
					"X-XSRF-TOKEN": getCsrfToken(),
				},
			});

			if (response.ok) {
				setCustomDomain("");
				await fetchDomainSettings();
				onUpdate?.();
			}
		} catch (error) {
			console.error("Failed to remove custom domain:", error);
		} finally {
			setLoading(false);
		}
	};

	// Verify domain
	const verifyDomain = async () => {
		setVerifying(true);
		try {
			const response = await fetch(`/proposals/${proposal.id}/domain/verify`, {
				method: "POST",
				headers: {
					"X-XSRF-TOKEN": getCsrfToken(),
				},
			});

			if (response.ok) {
				await fetchDomainSettings();
				onUpdate?.();
			}
		} catch (error) {
			console.error("Failed to verify domain:", error);
		} finally {
			setVerifying(false);
		}
	};

	const getDomainStatusBadge = (status: string) => {
		switch (status) {
			case "verified":
				return (
					<span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
						<CheckCircle className="h-3 w-3" />
						Vérifié
					</span>
				);
			case "verifying":
				return (
					<span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
						<Loader2 className="h-3 w-3 animate-spin" />
						En cours de vérification
					</span>
				);
			case "failed":
				return (
					<span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
						<AlertCircle className="h-3 w-3" />
						Échec
					</span>
				);
			default:
				return (
					<span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
						En attente
					</span>
				);
		}
	};

	return (
		<div className="space-y-6">
			{/* Subdomain Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Globe className="h-5 w-5" />
						Sous-domaine gratuit
					</CardTitle>
					<CardDescription>
						Obtenez une URL personnalisée sur {baseDomain}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{domainData?.subdomain ? (
						<div className="space-y-3">
							<div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
								<div className="flex items-center gap-2">
									<CheckCircle className="h-5 w-5 text-green-600" />
									<span className="font-medium text-green-800">
										{domainData.subdomainUrl}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											copyToClipboard(domainData.subdomainUrl!, "subdomain")
										}
									>
										{copied === "subdomain" ? (
											<Check className="h-4 w-4" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
									<a
										href={domainData.subdomainUrl!}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Button variant="ghost" size="sm">
											<ExternalLink className="h-4 w-4" />
										</Button>
									</a>
									<Button
										variant="ghost"
										size="sm"
										onClick={removeSubdomain}
										disabled={loading}
									>
										<X className="h-4 w-4 text-red-500" />
									</Button>
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-3">
							<div className="flex gap-2">
								<div className="flex-1">
									<div className="flex">
										<Input
											value={subdomain}
											onChange={(e) => {
												const value = e.target.value
													.toLowerCase()
													.replace(/[^a-z0-9-]/g, "");
												setSubdomain(value);
												setSubdomainError(null);
											}}
											onBlur={() => checkSubdomainAvailability(subdomain)}
											placeholder="mon-projet"
											className="rounded-r-none"
										/>
										<span className="inline-flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md text-sm text-muted-foreground">
											.{baseDomain}
										</span>
									</div>
									{subdomainError && (
										<p className="text-sm text-red-500 mt-1">
											{subdomainError}
										</p>
									)}
								</div>
								<Button
									onClick={saveSubdomain}
									disabled={loading || !subdomain || !!subdomainError}
								>
									{loading ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										"Activer"
									)}
								</Button>
							</div>
							<p className="text-xs text-muted-foreground">
								Uniquement lettres minuscules, chiffres et tirets. Minimum 3
								caractères.
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Custom Domain Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Globe className="h-5 w-5" />
						Domaine personnalisé
						<span className="text-xs font-normal px-2 py-0.5 bg-primary/10 text-primary rounded-full">
							Premium
						</span>
					</CardTitle>
					<CardDescription>
						Utilisez votre propre domaine pour une expérience marque blanche
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{domainData?.customDomain ? (
						<div className="space-y-4">
							<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
								<div className="flex items-center gap-3">
									{getDomainStatusBadge(domainData.domainStatus)}
									<span className="font-medium">{domainData.customDomain}</span>
								</div>
								<div className="flex items-center gap-2">
									{domainData.domainStatus === "verified" && (
										<a
											href={`https://${domainData.customDomain}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button variant="ghost" size="sm">
												<ExternalLink className="h-4 w-4" />
											</Button>
										</a>
									)}
									<Button
										variant="ghost"
										size="sm"
										onClick={removeCustomDomain}
										disabled={loading}
									>
										<X className="h-4 w-4 text-red-500" />
									</Button>
								</div>
							</div>

							{domainData.domainStatus !== "verified" &&
								domainData.dnsInstructions && (
									<div className="space-y-4">
										<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
											<h4 className="font-medium text-yellow-800 mb-2">
												Configuration DNS requise
											</h4>
											<p className="text-sm text-yellow-700 mb-4">
												Ajoutez ces enregistrements DNS chez votre registrar :
											</p>

											<div className="space-y-3">
												{/* CNAME Record */}
												<div className="p-3 bg-white rounded border">
													<div className="flex items-center justify-between mb-2">
														<span className="text-xs font-medium text-gray-500">
															CNAME
														</span>
														<Button
															variant="ghost"
															size="sm"
															onClick={() =>
																copyToClipboard(
																	domainData.dnsInstructions!.cname.value,
																	"cname",
																)
															}
														>
															{copied === "cname" ? (
																<Check className="h-3 w-3" />
															) : (
																<Copy className="h-3 w-3" />
															)}
														</Button>
													</div>
													<div className="grid grid-cols-2 gap-2 text-sm">
														<div>
															<span className="text-gray-500">Host:</span>{" "}
															<code className="bg-gray-100 px-1 rounded">
																{domainData.dnsInstructions.cname.host}
															</code>
														</div>
														<div>
															<span className="text-gray-500">Value:</span>{" "}
															<code className="bg-gray-100 px-1 rounded">
																{domainData.dnsInstructions.cname.value}
															</code>
														</div>
													</div>
												</div>

												{/* TXT Record */}
												<div className="p-3 bg-white rounded border">
													<div className="flex items-center justify-between mb-2">
														<span className="text-xs font-medium text-gray-500">
															TXT (Vérification)
														</span>
														<Button
															variant="ghost"
															size="sm"
															onClick={() =>
																copyToClipboard(
																	domainData.dnsInstructions!.txt.value,
																	"txt",
																)
															}
														>
															{copied === "txt" ? (
																<Check className="h-3 w-3" />
															) : (
																<Copy className="h-3 w-3" />
															)}
														</Button>
													</div>
													<div className="grid grid-cols-2 gap-2 text-sm">
														<div>
															<span className="text-gray-500">Host:</span>{" "}
															<code className="bg-gray-100 px-1 rounded">
																{domainData.dnsInstructions.txt.host}
															</code>
														</div>
														<div>
															<span className="text-gray-500">Value:</span>{" "}
															<code className="bg-gray-100 px-1 rounded text-xs break-all">
																{domainData.dnsInstructions.txt.value}
															</code>
														</div>
													</div>
												</div>
											</div>
										</div>

										<Button
											onClick={verifyDomain}
											disabled={verifying}
											className="w-full"
										>
											{verifying ? (
												<>
													<Loader2 className="h-4 w-4 mr-2 animate-spin" />
													Vérification en cours...
												</>
											) : (
												<>
													<RefreshCw className="h-4 w-4 mr-2" />
													Vérifier la configuration DNS
												</>
											)}
										</Button>
									</div>
								)}
						</div>
					) : (
						<div className="space-y-3">
							<div className="flex gap-2">
								<Input
									value={customDomain}
									onChange={(e) => {
										setCustomDomain(e.target.value.toLowerCase());
										setCustomDomainError(null);
									}}
									placeholder="sponsors.monsite.com"
									className="flex-1"
								/>
								<Button
									onClick={saveCustomDomain}
									disabled={loading || !customDomain || !!customDomainError}
								>
									{loading ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										"Configurer"
									)}
								</Button>
							</div>
							{customDomainError && (
								<p className="text-sm text-red-500">{customDomainError}</p>
							)}
							<p className="text-xs text-muted-foreground">
								Entrez le domaine ou sous-domaine que vous souhaitez utiliser.
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
