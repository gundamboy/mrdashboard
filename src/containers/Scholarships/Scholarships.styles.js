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

export const ScholarshipStatusHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    
    .current-scholarship-status {
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

export const ScholarshipSection = styled.div`
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
    
    .delete-app-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    
    form {
        .sub-title {
            margin-bottom: 5px;
        }
        
        .ant-form-item {
            margin-bottom: 1rem;
        }
        
        .grade-block {
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            
            &:last-child {border-bottom: none;}
        
            h3 {
            
            }
            
            .items {
                padding-left: 1rem;
            
                .ant-form-item-label {
                    
                }
            }
        }
    }
    
    .community-activities {
        .question-block {
            margin-bottom: 2rem;
        }
    }

    .account-information {
        
    }
    
    .work-experience {
        .employment-block {
            margin-bottom: 1rem;
        }
    }
    
    .essay-questions {
        .question-block {
            margin-bottom: 4rem;
        }
    }
    
    .info-wrapper {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 2rem;
        
        .profile-image-wrapper {
            img {
                max-width: 200px;
            }
        }
        
        .userContent {
            width: 100%;
            display: flex;
            flex-direction: column;
            padding-left: 1rem;
            
            h4 {
                font-size: 14px;
                margin: 0px;
                font-weight: 500;
            }
            
            .userAddress {}
        }
        
         @media only screen and (max-width: 768px) {
            flex-direction: column;
            
            .profile-image-wrapper {
                margin-bottom: 1rem;
            }
        }
    }
      
    .application-section-title {
        margin-bottom: 1rem;
        padding-bottom: 0.25rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
    }
    
    .no-document {
        .anticon {
            color: red;
            padding-right: 5px;
        }
    }
    
    .points-total {
        text-align: right;
    }
    
`;