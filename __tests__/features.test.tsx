    // Renders the Features component without crashing
    it('should render the Features component without crashing when features are provided', () => {
        const features = [
            {
                id: 1,
                title: 'Feature 1',
                description: 'Description 1',
                icon: () => <div>Icon</div>,
                color: '#00AE98',
                details: ['Detail 1', 'Detail 2']
            }
        ];
        const { container } = render(<Features features={features} />);
        expect(container).toBeInTheDocument();
    });