export class Env {
	public static readonly NODE_ENV: string = (process.env.NODE_ENV || "");
	public static readonly BASE_URL: string = (process.env.BASE_URL || "");
	/**
	 * The FQDN of the web server hosting the site's API.
	 */
	public static readonly SITE_API_DOMAIN: string = (process.env.VUE_APP_SITE_API_DOMAIN || "http://localhost:8081");
}
