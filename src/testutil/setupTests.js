import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import moment from 'moment'
import momentTimezone from 'moment-timezone'
import { init as initFeatureToggles } from '../util/featureToggles'

enzyme.configure({ adapter: new Adapter() })

moment.locale('de')
momentTimezone.locale('de')

initFeatureToggles()
