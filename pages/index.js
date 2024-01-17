import React from 'react';
import factory from '../ethereum/factory';
import Layout from '../components/layout';
import Link from 'next/link';

class index extends React.Component {

    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return { campaigns: campaigns }
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return (
                <div style={{border: '10px', borderColor: 'red'}}>
                    <h3>{this.props.campaigns[0]}</h3>
                    <a>View Campaign</a>
                </div> 
            )
        })
        return <div style={{border: '10px', borderColor: 'red'}} className="card">{items}</div>
    }
    
    render() {
        return (
            <Layout>
                <div>
                    <h2>Open Campaigns</h2>
                    <Link href="/campaigns/new"><button style={{height: "50px", float: "right", marginRight: "20px"}}>Create a Campaign</button></Link>
                    {this.renderCampaigns()}
                </div>
            </Layout>
            );
    }
}

export default index;