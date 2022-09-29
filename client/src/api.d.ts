declare namespace Components {
    namespace Schemas {
        export interface AddCategorization {
            /**
             * example:
             * products
             */
            belongs_to: "products" | "diagrams";
            /**
             * example:
             * compatibility
             */
            group: "compatibility" | "category" | "subcategory";
            /**
             * Name of the category
             * example:
             * Pump Type
             */
            name: string;
            /**
             * New category option
             * example:
             * HyPlex
             */
            option: string;
        }
        export type AddCategorizationOutput = any;
        export type Categorization = any;
        export interface Categorization1 {
            belongsTo: string;
            companyId: string;
            group: string;
            id: string;
            name: string;
            option: string;
        }
        export interface CategorizationList {
            categorizations: Categorization1[];
        }
        export type Categorizationlist = any;
        export interface DiagramPart {
            id?: string;
            position: number; // int32
            sku?: string;
        }
        export interface ERP {
            agileStatus: string;
            code0: string;
            code1: string;
            code2: string;
            coreID?: string;
            createdAt: number; // int32
            dateAdded: string;
            fpCategoryCode: string;
            itemRev: string;
            itemSubType: string;
            itemType: string;
            lifeCyclePhase: string;
            netWeight: number; // float
            pac3_Category: string;
            pac3_Class: string;
            pac3_ProductFamily: string;
            price: number; // int32
            sku: string;
            title: string;
            unit: string;
            updatedAt: number; // int32
        }
        export interface GetDiagrams {
            /**
             * Number of diagrams per page.
             * example:
             * 50
             */
            limit?: number; // int32
            /**
             * Number of parts filtering.
             * Filter the number of parts in the diagram. Uses value filtering.
             */
            nparts?: string;
            /**
             * page number
             * Page number for pagination.
             * example:
             * 11
             */
            page?: number; // int32
            /**
             * example:
             * true
             */
            published?: boolean;
            /**
             * text search
             * Search using part number or title.
             * example:
             * sensor assy
             */
            search?: string;
            /**
             * UTC Unix timestamp at which the diagram was updated with 1 second precision. Uses value filtering.
             */
            updated_at?: string;
        }
        export interface GetParts {
            /**
             * Number of parts per page.
             * example:
             * 50
             */
            limit?: number; // int32
            /**
             * example:
             * true
             */
            onshopify?: string;
            /**
             * Page number for pagination.
             * example:
             * 11
             */
            page?: number; // int32
            /**
             * Filter ERP price. Uses value filtering.
             */
            price?: string;
            /**
             * text search
             * Search using part number or title.
             * example:
             * sensor assy
             */
            search?: string;
            /**
             * UTC Unix timestamp at which the diagram was updated with 1 second precision. Uses value filtering.
             */
            updated_at?: string;
        }
        export interface GetProducts {
            /**
             * limit
             * Number of products per page
             * example:
             * 50
             */
            limit?: number; // int32
            /**
             * number of images filtering
             * Filter the number of images on the product</br>Uses value filtering</br>
             */
            nimages?: string;
            /**
             * number of parts filtering
             * Filter the number of parts in the product</br>Uses value filtering</br>
             * example:
             * lt:5,gt:0
             */
            nparts?: string;
            /**
             * page number
             * Page number for pagination
             * example:
             * 11
             */
            page?: number; // int32
            /**
             * price filtering
             * Filter ERP price</br>Uses value filtering</br>
             * example:
             * eq:10000
             */
            price?: string;
            /**
             * published
             * example:
             * true
             */
            published?: boolean;
            /**
             * text search
             * Search using part number or title
             * example:
             * sensor assy
             */
            search?: string;
            /**
             * updated at
             * example:
             * 15385430
             */
            updated_at?: string;
        }
        export interface JobStatus {
            companyId: string;
            errorlog: string;
            errors: number; // int32
            /**
             * example:
             * FE82fdsZ
             */
            jobid: string;
            name: string;
            progress: number; // float
            status: string;
            traceback: string;
        }
        export interface NewCategorization {
            categorization: Categorization;
        }
        export type OutputGetJob = any;
        export type OutputPartListing = any;
        export type OutputSingleProduct = any;
        export interface Part {
            alternate?: {} | null;
            discontinued?: boolean | null;
            erp?: {} | null;
            id: string;
            option_values?: string[] | null;
            position?: null | number; // int32
            promotion?: null | number; // int32
            replacements?: {}[] | null;
            sale_price?: null | number; // int32
            sku?: string | null;
            upsell?: boolean | null;
        }
        export interface Part1 {
            alternate?: {} | null;
            discontinued?: boolean | null;
            erp?: {} | null;
            id: string;
            option_values?: string[] | null;
            position?: null | number; // int32
            promotion?: null | number; // int32
            replacements?: {}[] | null;
            sale_price?: null | number; // int32
            sku?: string | null;
            upsell?: boolean | null;
        }
        export interface PartForListing {
            createdAt: number; // int32
            engineering_title: string;
            erp?: {
                agileStatus: string;
                code0: string;
                code1: string;
                code2: string;
                coreID?: string;
                createdAt: number; // int32
                dateAdded: string;
                fpCategoryCode: string;
                itemRev: string;
                itemSubType: string;
                itemType: string;
                lifeCyclePhase: string;
                netWeight: number; // float
                pac3_Category: string;
                pac3_Class: string;
                pac3_ProductFamily: string;
                price: number; // int32
                sku: string;
                title: string;
                unit: string;
                updatedAt: number; // int32
            } | null;
            id: string;
            image?: string | null;
            onshopify: boolean;
            price: number; // int32
            product_id?: string | null;
            shopify_title?: string | null;
            sku: string;
            updatedAt: number; // int32
        }
        export interface PartListing {
            has_next_page: boolean;
            parts: PartForListing[];
        }
        export interface PostDiagrams {
            title: string;
            /**
             * Provided by the [image diagram endpoint](/#/paths/~1pim~1diagrams~1images/post).
             */
            tmp_image_id: string;
        }
        export interface PostProducts {
            /**
             * example:
             * [
             *   "23FWq4e9",
             *   "J29d2dQq"
             * ]
             */
            parts?: string[];
            /**
             * example:
             * TEST PRODUCT
             */
            title: string;
        }
        export interface Product {
            /**
             * example:
             * false
             */
            call_only?: boolean | null;
            /**
             * example:
             * [
             *   "zX28heWf",
             *   "89eDrfE"
             * ]
             */
            categorization?: string[] | null;
            /**
             * example:
             * My super mixing tube
             */
            description?: string | null;
            /**
             * example:
             * mixing-tube-alpha
             */
            handle?: string | null;
            /**
             * example:
             * 34hbE22h
             */
            id?: string | null;
            /**
             * example:
             * []
             */
            images?: string[] | null;
            /**
             * example:
             * true
             */
            installation_required?: boolean | null;
            /**
             * example:
             * [
             *   "Diameter"
             * ]
             */
            option_titles?: string[] | null;
            parts?: Part1[] | null;
            /**
             * example:
             * true
             */
            published?: boolean | null;
            /**
             * example:
             * Genuine Shape mixing tube
             */
            seodescription?: string | null;
            /**
             * example:
             * Shape's mixing tube Alpha
             */
            seotitle?: string | null;
            /**
             * example:
             * Mixing Tube Alpha
             */
            title?: string | null;
            /**
             * example:
             * false
             */
            web_heavy?: boolean | null;
        }
        export interface PutSingleDiagram {
            categorization?: string[];
            createdAt?: number; // int32
            /**
             * example:
             * diagram1
             */
            id: string;
            /**
             * example:
             * https://cdn.shopify.com/s/files/1/1605/0487/articles/diagram1.png
             */
            image: string;
            /**
             * example:
             * diagram1
             */
            name: string;
            /**
             * example:
             * [
             *   {
             *     "id": "Bka11wrg",
             *     "position": 1
             *   },
             *   {
             *     "id": "91mCCwq0",
             *     "position": 2
             *   }
             * ]
             */
            parts?: DiagramPart[];
            /**
             * example:
             * true
             */
            published: boolean;
            updatedAt?: number; // int32
        }
        export interface PutSingleProduct {
            call_only?: boolean;
            /**
             * example:
             * [
             *   "R8h0rf33",
             *   "93rEEfeo"
             * ]
             */
            categorization?: string[];
            /**
             * example:
             * My super product is awesome with lots of features
             */
            description?: string;
            /**
             * example:
             * my-new-product
             */
            handle?: string;
            id?: string;
            installation_required?: boolean;
            option_titles?: string[];
            /**
             * Either the parts field is omitted or all parts must be provided, with at least the id field
             * example:
             * [
             *   {
             *     "id": "Rn21n8f8"
             *   },
             *   {
             *     "id": "9jR2r29E",
             *     "promotion": 100
             *   }
             * ]
             */
            parts?: UpdatePart[];
            /**
             * example:
             * true
             */
            published?: boolean;
            seodescription?: string;
            seotitle?: string;
            /**
             * example:
             * My new product
             */
            title?: string;
        }
        export interface Replacement {
            brand?: "iwp" | "accu" | "flow" | "kmt" | "jetedge" | "omax" | "wsi" | "bystronic" | "tecnocut" | "other";
            sku?: string;
        }
        export type SinglePart = any;
        export interface UpdatePart {
            alternate?: {};
            discontinued?: boolean;
            id: string;
            option_values?: string[];
            promotion?: number; // int32
            replacements?: Replacement[];
            upsell?: boolean;
        }
    }
}
declare namespace Paths {
    namespace PimCategorizations {
        namespace Post {
            export type RequestBody = Components.Schemas.AddCategorization;
            namespace Responses {
                export type $200 = Components.Schemas.NewCategorization;
            }
        }
    }
    namespace PimCategorizationsDiagrams {
        namespace Get {
            namespace Responses {
                export type $200 = Components.Schemas.CategorizationList;
            }
        }
    }
    namespace PimCategorizationsProducts {
        namespace Get {
            namespace Responses {
                export type $200 = Components.Schemas.CategorizationList;
            }
        }
    }
    namespace PimDiagrams {
        namespace Get {
            namespace Parameters {
                /**
                 * example:
                 * 50
                 */
                export type Limit = number; // int32
                /**
                 * Number of parts filtering.
                 */
                export type Nparts = string;
                /**
                 * page number
                 * example:
                 * 11
                 */
                export type Page = number; // int32
                /**
                 * example:
                 * true
                 */
                export type Published = boolean;
                /**
                 * text search
                 * example:
                 * sensor assy
                 */
                export type Search = string;
                export type UpdatedAt = string;
            }
            export interface QueryParameters {
                limit?: /**
                 * example:
                 * 50
                 */
                Parameters.Limit /* int32 */;
                published?: /**
                 * example:
                 * true
                 */
                Parameters.Published;
                search?: /**
                 * text search
                 * example:
                 * sensor assy
                 */
                Parameters.Search;
                updated_at?: Parameters.UpdatedAt;
                nparts?: /* Number of parts filtering. */ Parameters.Nparts;
                page?: /**
                 * page number
                 * example:
                 * 11
                 */
                Parameters.Page /* int32 */;
            }
        }
        namespace Post {
            export type RequestBody = Components.Schemas.PostDiagrams;
        }
    }
    namespace PimDiagrams$Diagramid {
        namespace Delete {
            namespace Parameters {
                export type Diagramid = string;
            }
            export interface QueryParameters {
                diagramid?: Parameters.Diagramid;
            }
        }
        namespace Get {
            namespace Parameters {
                export type Diagramid = string;
            }
            export interface QueryParameters {
                diagramid?: Parameters.Diagramid;
            }
        }
        namespace Put {
            export type RequestBody = Components.Schemas.PutSingleDiagram;
        }
    }
    namespace PimJobs$Jobid {
        namespace Delete {
            namespace Parameters {
                export type Jobid = string;
            }
            export interface QueryParameters {
                jobid?: Parameters.Jobid;
            }
        }
        namespace Get {
            namespace Parameters {
                export type Jobid = string;
            }
            export interface QueryParameters {
                jobid?: Parameters.Jobid;
            }
            namespace Responses {
                export type $200 = Components.Schemas.JobStatus;
            }
        }
    }
    namespace PimParts {
        namespace Get {
            namespace Parameters {
                /**
                 * example:
                 * 50
                 */
                export type Limit = number; // int32
                /**
                 * example:
                 * true
                 */
                export type Onshopify = string;
                /**
                 * example:
                 * 11
                 */
                export type Page = number; // int32
                export type Price = string;
                /**
                 * text search
                 * example:
                 * sensor assy
                 */
                export type Search = string;
                export type UpdatedAt = string;
            }
            export interface QueryParameters {
                limit?: /**
                 * example:
                 * 50
                 */
                Parameters.Limit /* int32 */;
                price?: Parameters.Price;
                search?: /**
                 * text search
                 * example:
                 * sensor assy
                 */
                Parameters.Search;
                updated_at?: Parameters.UpdatedAt;
                onshopify?: /**
                 * example:
                 * true
                 */
                Parameters.Onshopify;
                page?: /**
                 * example:
                 * 11
                 */
                Parameters.Page /* int32 */;
            }
            namespace Responses {
                export type $200 = Components.Schemas.PartListing;
            }
        }
    }
    namespace PimParts$PartId {
        namespace Get {
            namespace Responses {
                export type $200 = Components.Schemas.Part;
            }
        }
    }
    namespace PimProducts {
        namespace Get {
            namespace Parameters {
                /**
                 * limit
                 * example:
                 * 50
                 */
                export type Limit = number; // int32
                /**
                 * number of images filtering
                 */
                export type Nimages = string;
                /**
                 * number of parts filtering
                 * example:
                 * lt:5,gt:0
                 */
                export type Nparts = string;
                /**
                 * page number
                 * example:
                 * 11
                 */
                export type Page = number; // int32
                /**
                 * price filtering
                 * example:
                 * eq:10000
                 */
                export type Price = string;
                /**
                 * published
                 * example:
                 * true
                 */
                export type Published = boolean;
                /**
                 * text search
                 * example:
                 * sensor assy
                 */
                export type Search = string;
                /**
                 * updated at
                 * example:
                 * 15385430
                 */
                export type UpdatedAt = string;
            }
            export interface QueryParameters {
                limit?: /**
                 * limit
                 * example:
                 * 50
                 */
                Parameters.Limit /* int32 */;
                price?: /**
                 * price filtering
                 * example:
                 * eq:10000
                 */
                Parameters.Price;
                nimages?: /* number of images filtering */ Parameters.Nimages;
                published?: /**
                 * published
                 * example:
                 * true
                 */
                Parameters.Published;
                search?: /**
                 * text search
                 * example:
                 * sensor assy
                 */
                Parameters.Search;
                updated_at?: /**
                 * updated at
                 * example:
                 * 15385430
                 */
                Parameters.UpdatedAt;
                nparts?: /**
                 * number of parts filtering
                 * example:
                 * lt:5,gt:0
                 */
                Parameters.Nparts;
                page?: /**
                 * page number
                 * example:
                 * 11
                 */
                Parameters.Page /* int32 */;
            }
        }
        namespace Post {
            namespace Parameters {
                /**
                 * example:
                 * [
                 *   "23FWq4e9",
                 *   "J29d2dQq"
                 * ]
                 */
                export type Parts = string[];
                /**
                 * example:
                 * TEST PRODUCT
                 */
                export type Title = string;
            }
            export interface QueryParameters {
                title: /**
                 * example:
                 * TEST PRODUCT
                 */
                Parameters.Title;
                parts?: /**
                 * example:
                 * [
                 *   "23FWq4e9",
                 *   "J29d2dQq"
                 * ]
                 */
                Parameters.Parts;
            }
        }
    }
    namespace PimProducts$ProductId {
        namespace Put {
            export type RequestBody = Components.Schemas.PutSingleProduct;
            namespace Responses {
                export type $200 = Components.Schemas.Product;
            }
        }
    }
    namespace PimStores {
        namespace Put {
            export interface RequestBody {
                /**
                 * Company id you want to assign to the store.
                 * example:
                 * ml0Uy62q
                 */
                company_id?: string;
            }
        }
    }
}
