import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface FlagBtnProps{
    children: any;
    icon: IconDefinition;
    onClick: any;
    tooltipText: string;
    calloutText: string;
}