import styled from 'styled-components';

export const ReferralSection = styled.div`
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
    
    .subtitle {
        font-weight: bold;
    }
    
    form {
        .sub-title {
            margin-bottom: 5px;
        }
        
        .ant-form-item {
            margin-bottom: 1rem;
        }
    }
    
    &.admin-section {
        margin-bottom: 3rem;
    }
  
    .application-section-title {
        margin-bottom: 1rem;
        padding-bottom: 0.25rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
    }
    
    .admin-section-title {
        margin-bottom: 1rem;
        padding-bottom: 0.25rem;
    }
    
    .preview-email-button-wrapper {
        .hide {
            display: none;
        }
        
        text-align: right;
        max-width: 300px;
    }
`;

export const StatusHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    
    .current-status {
        font-size: 16px;
        font-weight: 500;
        color: #788195;
        margin-right: 17px;
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        white-space: nowrap;
        text-transform: capitalize;
        
        .status {
            margin-left: 0.5rem;
            
            &.denied {
                color: #ff4d4f;
            }
            
            &.approved {
                color: #52c41a;
            }        
        }
    }
`;

export const EditorWrapper = styled.div`
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
`;

export const EditorControls = styled.div`
    .send-email-button-wrapper {
        display: flex;
        justify-content: space-between;
    
        .cancel-email-btn {
            
        }
`;