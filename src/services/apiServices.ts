import axios from "axios";
import { GitHubIssue } from "../types";

const BASE_URL = "https://api.github.com/search";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_APP_GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  },
});

const apiService = {
  searchIssues: async (
    language: string | null,
    searchString: string | null,
    page: number | null,
  ): Promise<{
    total_count: number;
    incomplete_results: boolean;
    error: string;
    items: GitHubIssue[] | null;
  }> => {
    const labelQueryParam = 'label:"good first issue" ';
    const languageQueryParam = `language:${language} `;
    const stateQueryParam = "state:open ";
    const searchQueryParam = searchString ? `${searchString} ` : "";

    try {
      const response = await api.get("/issues", {
        params: {
          q: `${searchQueryParam}${labelQueryParam}${languageQueryParam}${stateQueryParam}`,
          sort: "created",
          order: "desc",
          page: page,
          per_page: 10,
        },
      });

      // add language since there is no language in the issue response
      await Promise.all(
        response.data.items.map(async (issue: GitHubIssue) => {
          const data = await apiService.getRepoDetails(issue.repository_url);
          issue.repository_language = data.language;
          issue.repository_stars = data.stargazers_count;
          console.log(data);
        }),
      );
      console.log(response);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", error.response);
        if (error.response.status === 403) {
          console.error("Access denied: 403 Forbidden");
          return {
            incomplete_results: false,
            items: null,
            total_count: 0,
            error: "Access denied. Please check your permissions.",
          };
        } else {
          return {
            incomplete_results: false,
            items: null,
            total_count: 0,
            error: `Error: ${error.response.status} ${error.response.statusText}`,
          };
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        return {
          incomplete_results: false,
          items: null,
          total_count: 0,
          error: "No response from server. Please try again later.",
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        return {
          incomplete_results: false,
          items: null,
          total_count: 0,
          error: "An unexpected error occurred. Please try again.",
        };
      }
    }
  },

  getRepoDetails: async (repoUrl: string) => {
    const response = await api.get(repoUrl);
    return response.data;
  },
};

export default apiService;
