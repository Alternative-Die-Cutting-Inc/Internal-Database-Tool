/**
 * @fileOverview Confetti storybook file. This file contains all stories related to Confetti component.
 * @author Farbod Mohammadzadeh - https://github.com/Freeassassin
 * @version 1.0
 * @date 2023-06-07
 * @description This file contains all stories related to Confetti component.
 * @resource https://storybook.js.org/docs/react/writing-stories/introduction
 */
import { Confetti } from './Confetti';

export default {
  title: 'Confetti',
  component: Confetti,
};

export const ConfettiStory = (args) => <Confetti {...args} />;
ConfettiStory.storyName = 'Confetti';
ConfettiStory.args = {
  animate: true,
};
