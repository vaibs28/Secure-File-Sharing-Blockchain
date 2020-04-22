import {Enum} from 'enumify';

class WebServiceErrorStatusesEnum extends Enum {}
WebServiceErrorStatusesEnum.initEnum(['FileNotExist', 'UnauthorizedUser', 'Wrongkey','FileAlreadyExists', "DifferentAddError", "DifferentGetError"]);

export default WebServiceErrorStatusesEnum;