export interface Order { 
    id: bigint; // Assuming bigint type
    number: number; // Number type
    created_at: string; // Timestamp with time zone represented as string
    wallet_address: string;
    country: string;
    status: string;
    order_id: string;
    shipping_info: Record<string, any>; // JSON type
    billing_info: Record<string, any>; // JSON type
    request_id: string;
    payment_tx: string;
    return_tx: string;
    creation_tx: string;
    tax_request_id: string;
    tax_amount: number; // Double precision
    total_amount: number; // Double precision
    subtotal_amount: number; // Double precision
    amount_paid: number; // Double precision
    shipping_amount: number; // Double precision
    previous_status: string[]; // Array of strings
    products: Record<string, any>[]; // Array of JSON objects
    tracking: string[];
    retailer: string;
}

export interface Subscription { 

}



