import styled from 'styled-components';

export const AdvancedOptionsWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;   
`;

export const AdvancedOptions = styled.div`
    display: none;
    
    &.show {
        display: block;
    }
`;

export const ApplicationSection = styled.div`
    .ant-table-wrapper {
        margin-bottom: 3rem;
        
        .address {
            display: block;
        }
        
        tr {
            td:nth-child(even) {
                p {
                    max-width: 397px;
                    white-space: normal;
                }
            }
        }
    }
    
    .application-section-title {
        margin-bottom: 0.5rem;
    }
    
    .email-preview {
        animation: fadeInDown 1s ease-out;
        
        .email-instructions {
            margin-bottom: 0.5rem;
        }       
    }
    
    .editor-wrapper {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        border: 1px solid #dddddd;
        margin-bottom: 10px;
        
        &.disabled {
            .DraftEditor-root {
            }
        }
         
        .editor-buttons {
            padding: 10px;
            background: #efefef;
            border-bottom: 1px solid #dddddd;
            
            .instructions {
                p {
                    margin-bottom: 0.25rem;
                    
                    .syntax {
                        font-weight: bold;
                    }
                }
            }
            
            button {
                margin-right: 5px;
            }
            
            button:last-child {
                margin-right: 0;
            }
        }
        
        .DraftEditor-root {
            padding: 10px;  
            
            
            .public-DraftEditor-content {
                div[data-block], section[data-block] {
                    margin-bottom: 10px;
                    
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
                
            } 
        }
    }
    
    .editor-controls {
        .send-email-button-wrapper {
            display: flex;
            justify-content: space-between;
        
            .cancel-email-btn {
                
            }
        }
    }
    
    
    
    .admin-section {
        margin-bottom: 2rem;
        width: 100%;
        
        .status {
            margin-bottom: 0.5rem;
            text-transform: capitalize
        }
        
        .date {margin-bottom: 1.5rem;}
        
        .notification-status {
            margin-top: 0.5rem;
        }
        
        .approvalDate {
                        
            &.approved {
                color: #7ED321;
            }
            
            &.denied {
                color: #F75D81;
            }
        }
        
        .form-group {
            .group-title {
                margin-bottom: 0.5rem;    
            }
            
        }
        
        .applicantNotified {
            margin-top: 1rem;
            color: #F75D81;
        }
        
        .show-advanced-chkbox {}
        
        .ant-btn-delete.delete-record-btn {
            margin-top: 1rem;
            background-color: #fff2f0;
            border: 1px solid #ffccc7;
            
            &:hover, &:active, &:focus {
                background-color: #ffd7d0;
                border: 1px solid #fd8175;
                color: rgba(0,0,0,0.85);
            }
        }
    }
    
    .btn-row {
        margin-bottom: 1rem;
    }
    
    .send-email-button-wrapper {
        display: flex;
        justify-content: flex-end;
    }
    
    .send-email-to-email-applicant {
        
    }
    
    
    
    .ant-form-item {
        margin-bottom: 2rem;
        
        .amountApproved {
            width: 200px;
        }
        
        .ant-form-item-label {
            label {
                align-items: flex-end;  
                height: 30px;
            }
        }
        
        &.itemQty {
            margin-bottom: 0.5rem;
            input[id$='itemQty'] {
                width: 70px;
            }
        }
        
        &.itemName {
            margin-bottom: 0.5rem;
            input[id$='itemName'] {
                
            }
        }
    }
    
    .pending {}
    
    .approved {}
    
    .denied {}
    
    @keyframes fadeInDown {
        0% {
            opacity: 0;
            transform: translateY(-20px);
        }
        
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;