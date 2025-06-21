Here’s a clear, actionable task list for an AI coding agent to build the MVP described in the PRD:

1. **Project Setup**
   - Initialize a new Expo project (React Native + Web).
   - Set up TypeScript, Tailwind CSS, and Prettier.
   - Configure strict mode in TypeScript.
   - Add essential dependencies: react-navigation, react-native-safe-area-context, expo-constants, expo-localization, react-query, zod, etc.

2. **Core UI Structure**
   - Implement SafeAreaProvider and global SafeAreaView.
   - Set up navigation (stack or tab) for main screens: Input, Protocol, Commit, Progress.
   - Implement dark mode support using useColorScheme.

3. **User Input Form**
   - Build a form for:
     - Goal selection (Sleep, Energy, Focus, etc.)
     - Top struggle (free text)
     - Time per day (slider)
     - Budget (dropdown)
   - Validate inputs with Zod.
   - Ensure accessibility and responsive design.

4. **Protocol Generation (LLM Integration)**
   - Create API utility to call LLM (mock or real endpoint).
   - Send user inputs, receive protocol JSON (as per PRD example).
   - Display loading and error states.

5. **Protocol Display**
   - Show protocol name, summary, and daily actions.
   - For each action: title, description, timing, and science summary.
   - Use accessible, mobile-friendly UI.

6. **Commitment Selection**
   - Allow user to select 1–3 habits to commit to.
   - Collect free-form commitment statement.
   - Parse/extract structured data from commitment (habit, schedule, date).

7. **Progress Tracking**
   - Implement calendar-style tracker for habits/commitments.
   - Allow daily check-off; show positive feedback on completion.
   - Add weekly reflection modal: review progress, log changes, commit to next week.

8. **State Management & Storage**
   - Use React Context + useReducer for global state.
   - Persist data locally with AsyncStorage.

9. **Performance & Accessibility**
   - Optimize images and assets.
   - Ensure all components meet a11y standards.
   - Profile and memoize components as needed.

10. **Testing**
    - Write unit tests (Jest, React Native Testing Library).
    - Add integration tests for user flows.

11. **(Optional/Stretch)**
    - Set up Expo Notifications for reminders.
    - Add OTA updates with expo-updates.

12. **Deployment**
    - Prepare for Expo web and mobile deployment.
    - Follow Expo’s best practices for publishing.

Let me know if you want this as a checklist in your plan.md, or if you want to break down the first task!