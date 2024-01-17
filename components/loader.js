import React from 'react'
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

const Spinner = () => (
  <div>
    <Segment>
      <Dimmer active>
        <Loader indeterminate>Preparing Files</Loader>
      </Dimmer>

      <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
    </Segment>
  </div>
)

export default Spinner;