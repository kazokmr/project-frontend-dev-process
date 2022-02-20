import ColorFilter from "../todo/operating/ColorFilter";
import {render} from "@testing-library/react";

describe("カラーフィルターの初期値をチェックする", () => {

    test('初期選択が配列がなければ全てFalse', () => {
        const {queryAllByRole} = render(<ColorFilter/>);
        expect(queryAllByRole('checkbox', {checked: false}).map(e => e.getAttribute('name'))).toEqual(['green', 'blue', 'orange', 'purple', 'red']);
    });

    test('propsにセットした色は初期選択されること', () => {
        const {queryAllByRole} = render(<ColorFilter curColors={['green', 'purple']}/>);
        expect(queryAllByRole('checkbox', {checked: true}).map(e => e.getAttribute('name'))).toEqual(['green', 'purple']);
        expect(queryAllByRole('checkbox', {checked: false}).map(e => e.getAttribute('name'))).toEqual(['blue', 'orange', 'red']);
    });

});
