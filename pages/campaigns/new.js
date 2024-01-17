import React from 'react';
import factory from '../../ethereum/factory';
import Layout from '../../components/layout';
import web3 from '../../ethereum/web3';
import Loader from '../../components/loader';
import { Form, Button, Input, Message } from 'semantic-ui-react';

class newCampaign extends React.Component {

    state = {address: '', minContribution: 0}

    componentDidUpdate() {
        console.log(this.state.address);
        console.log(this.state.minContribution);
    }

    onSubmit = async (event) => {
        // keeps browser from submitting the form
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        try{
            await factory.methods.createCampaign(this.state.address, this.state.minContribution).send({ from: accounts[0] });

        }catch (err) {
            this.setState({errorMessage: err.message});
        }
        
    }

    render() {
        return (
            <Layout>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Owner Address</label>
                        <Input
                        value={this.state.address}
                        onChange={event => this.setState({ address: event.target.value })} />
                        <label>Minimum Contribution</label>
                        <Input
                        label="wei"
                        labelPosition="right"
                        value={this.state.minimumContribution}
                        onChange={event => this.setState({ minimumContribution: event.target.value })} />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>
                        Create!
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default newCampaign;