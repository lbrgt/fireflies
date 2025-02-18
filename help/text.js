var textContent = {
    'helpLeader': {
        'title': 'Follow leader(s)',
        'content': `
        In this strategy, a certain number of fireflies are selected to be local leaders. Fireflies close to them will adapt their cycle accordingly.
        The adaptation is: when you see a leader flash, nudge your clock forward.  
        You can add more leaders.
        You can select how much the fireflies will adapt per cycle.`

    },
    'helpClock': {
        'title': 'Follow master clock',
        'content': `In this strategy, fireflies will adapt their flashing to a global clock.
        You can move the global clock by dragging it on the screen.
        You can change the radius of influence of the global clock.`
    },
    'helpDecentralized': {
        'title': 'Decentralized behavior',
        'content': `In this strategy, individual fireflies adapt their behavior to local neighbors.
        The rule a firefly follows is : when you see a nearby firefly flash, nudge your clock forward.
        You can change the radius of influence of an individual fireflies.
        You can select how much the fireflies will adapt per cycle.`
    },

    'helpDebug': {
        'title': 'Debug help',
        'content': `
    - Add chaos: when activated, you can click in the simulation to randomly reset the fireflies' clocks close to the mouse.
    - Reset fireflies: randomly reset all the internal clocks of the fireflies.
    - Reset everything: randomly reset all clocks and also all parameters.`
    }
};