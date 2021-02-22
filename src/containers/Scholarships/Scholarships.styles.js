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
    
    form {
        .ant-form-item {
            margin-bottom: 2rem;}
    }
`;