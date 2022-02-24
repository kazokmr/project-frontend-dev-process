import ColorFilter from "../todo/operating/ColorFilter";
import {render, screen} from "@testing-library/react";

describe("カラーフィルターの初期値をチェックする", () => {

    test('初期選択が配列がなければ全てFalse', () => {
        render(<ColorFilter/>);
        expect(screen.getAllByRole('checkbox', {checked: false}).map(e => e.getAttribute('name')))
            .toEqual(['green', 'blue', 'orange', 'purple', 'red']);
    });

    test('propsにセットした色は初期選択されること', () => {
        render(<ColorFilter curColors={['green', 'purple']}/>);
        expect(screen.getAllByRole('checkbox', {checked: true}).map(e => e.getAttribute('name')))
            .toEqual(['green', 'purple']);
        expect(screen.getAllByRole('checkbox', {checked: false}).map(e => e.getAttribute('name')))
            .toEqual(['blue', 'orange', 'red']);
    });

});
