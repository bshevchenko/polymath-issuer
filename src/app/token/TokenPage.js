// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Icon } from 'carbon-components-react'
import { etherscanTx, TxSuccess } from 'polymath-ui'
import moment from 'moment'
import type { SecurityToken } from 'polymathjs/types'

import { complete } from './actions'
import NotFoundPage from '../NotFoundPage'
import Progress from './components/Progress'
import CompleteTokenForm from './components/CompleteTokenForm'
import type { RootState } from '../../redux/reducer'

type StateProps = {|
  token: ?SecurityToken,
  isDeploySuccess: boolean,
|}

type DispatchProps = {|
  complete: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  isDeploySuccess: state.pui.tx.success !== null,
})

const mapDispatchToProps: DispatchProps = {
  complete,
}

type Props = {|
|} & StateProps & DispatchProps

class TokenPage extends Component<Props> {

  handleCompleteSubmit = () => {
    this.props.complete()
  }

  render () {
    const { token, isDeploySuccess } = this.props
    if (!token) {
      return <NotFoundPage />
    }
    // $FlowFixMe
    const txSuccess = <TxSuccess className='pui-single-box-internal' />
    return (
      <DocumentTitle title={`${token.ticker} Token – Polymath`}>
        <div>
          <Progress />
          <div>
            {isDeploySuccess ? txSuccess : (
              <div className='bx--row'>
                {!token.address ? (
                  <div className='bx--col-xs-7'>
                    <div className='pui-page-box'>
                      <div>
                        <h2 className='pui-h2'>
                          <Icon name='warning--glyph' fill='#efc100' width='27' height='24' />
                          Complete Token Registration
                        </h2>
                        <h3 className='pui-h3'>
                          Complete your security token registration before it expires.
                          If your registration expires the token symbol you selected will be made available for others to claim.
                        </h3>
                        <br /><br />
                        <h2 className='pui-h2'>Security Token Issuance</h2>
                        <h3 className='pui-h3'>
                          You are one step closer to issuing your Security Token.
                          Please ensure you have the necessary documentation and information before you proceed.
                        </h3>
                        <CompleteTokenForm onSubmit={this.handleCompleteSubmit} />
                      </div>
                    </div>
                  </div>
                ) : ''}
                <div className='bx--col-xs-5'>
                  <div className='pui-page-box'>
                    <div className='ticker-field'>
                      <div className='bx--form-item'>
                        <label htmlFor='ticker' className='bx--label'>Token Symbol</label>
                        <input
                          type='text'
                          name='ticker'
                          value={token.ticker}
                          id='ticker'
                          readOnly
                          className='bx--text-input bx--text__input'
                        />
                      </div>
                    </div>
                    <div className='bx--form-item'>
                      <label htmlFor='name' className='bx--label'>Token Name</label>
                      <p>{token.name}</p>
                    </div>
                    <div className='bx--form-item'>
                      <label htmlFor='owner' className='bx--label'>Symbol Registration Transaction</label>
                      <p>
                        {etherscanTx(token.txHash, token.txHash)}
                      </p>
                    </div>
                    <div className='bx--form-item'>
                      <label htmlFor='name' className='bx--label'>Symbol Registration Date</label>
                      <p>{moment(token.timestamp).format('D MMMM, YYYY')}</p>
                    </div>
                    <hr />
                    <div className='bx--form-item'>
                      <label htmlFor='name' className='bx--label'>Issuer&apos;s ETH Address</label>
                      <p>{token.owner}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenPage)
