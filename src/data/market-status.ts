/**
 * Publication-controlled editorial assertions, not a Control Plane registry.
 * Future integration must resolve authoritative company/market assignments
 * with provenance before any 'operating' status is displayed.
 */
export type MarketStatus = "registered" | "interest" | "operating";
export type MarketStatement = {country:string; status:MarketStatus; description:string; attribution:string};
export const MARKET_STATEMENTS:MarketStatement[]=[
 {country:"South Africa",status:"registered",description:"Nabhold Group Africa and Thamani Global are registered legal entities. This does not assert that either is trading.",attribution:"Group-confirmed registration; independently verified evidence to be published"},
 {country:"Uganda",status:"interest",description:"A market under consideration for separately governed company development. No active trading status is asserted.",attribution:"Group expansion planning"}
];
