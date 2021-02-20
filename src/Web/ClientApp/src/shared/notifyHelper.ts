
import { toast } from 'react-toastify';
 
export default class  notifyHelper {
    public static error(message: string){
        toast(message);
    }
}
 