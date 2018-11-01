import dotenv from "dotenv";
dotenv.config();

export class Env {
	public static readonly PROJECT_DIR: string = (process.env.PROJECT_DIR || __dirname);
	public static readonly PORT: number = (process.env.PORT ? parseInt(process.env.PORT, 10) : 8080);
	/**
	 * The FQDN of the web server hosting the site's API.
	 */
	public static readonly SITE_API_DOMAIN: string = (process.env.SITE_API_DOMAIN || "http://localhost:8081");
}
