import { SET_TERM, SetTermAction } from '../reducers/term';

/**
 * Sets the current term.
 * Called from the landing page upon term selection
 * @param term The term, such as 201931
 */
export default function setTerm(term: string): SetTermAction {
  return {
    type: SET_TERM,
    term,
  };
}
