export interface Company {
  name: string
  legalName?: string
  uri?: string
  locality?: string
  type?: string
  address?: string
}

export interface QRBillData {
  creditor?: {
    name?: string
    address?: string
    postalCode?: string
    city?: string
    country?: string
  }
  debtor?: {
    name?: string
    address?: string
    postalCode?: string
    city?: string
    country?: string
  }
  amount?: number
  currency?: string
  iban?: string
  reference?: string
  referenceType?: string
  additionalInformation?: string
}

export interface Barcode {
  text: string
  qrBill?: QRBillData
}

export interface InnerDocument {
  text: string
  company?: Company
}

export interface Highlight {
  text: string[]
}

export interface Relation {
  value: number
  relation: string
}

export interface Hits<T> {
  hits: T[]
  total: Relation
}

export interface SearchResult<T> {
  hits?: Hits<T>
  _scroll_id?: string
}

export interface Document {
  _id: string
  _source: InnerDocument
  highlight?: Highlight
}

export interface DocumentDetails {
  id: string
  dates?: string[]
  primaryDate?: string
  indexedAt?: string
  text?: string
  company?: Company
  barcodes?: Barcode[]
}
