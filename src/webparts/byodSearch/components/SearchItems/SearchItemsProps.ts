import { WebPartContext } from "@microsoft/sp-webpart-base";

export default interface SearchItemsProps{
    items: any;
    searchTerm: string;
    memberOfGroups: any;
    context: WebPartContext;
}