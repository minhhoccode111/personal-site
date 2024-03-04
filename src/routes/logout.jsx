import { redirect } from 'react-router-dom';
import { set } from './../methods/index';

export function loader() {
	// clear local storage
	set({});

  return redirect('/');
}
