import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Prediction } from '../apps/web/src/components/Prediction';
it('reveals the rationale only after a confirmed answer', () => {
 render(<Prediction/>);
 expect(screen.queryByText(/El postincremento devuelve/)).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('radio',{name:'2 1'}));
 fireEvent.click(screen.getByRole('button',{name:'Comprobar razonamiento'}));
 expect(screen.getByText(/El postincremento devuelve/)).toBeInTheDocument();
 expect(screen.getByRole('radio',{name:'2 1'})).toBeDisabled();
});
