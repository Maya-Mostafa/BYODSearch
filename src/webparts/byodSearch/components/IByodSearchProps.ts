import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IByodSearchProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

  context: WebPartContext;
  siteUrl: string;
  listName: string;
}
