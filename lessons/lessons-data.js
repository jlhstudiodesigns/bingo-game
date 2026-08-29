/**
 * Art Lesson Plans — Data File
 * ════════════════════════════════════════════════════════════
 *
 * Add a new lesson object to the LESSONS array each week.
 * The LAST entry in the array is shown by default (most recent).
 * Use ↑ / ↓ arrow keys or the header arrows to navigate between weeks.
 *
 * ── Lesson object fields ──────────────────────────────────────
 *
 *  id            string   Unique ID, e.g. 'week-03-2026'
 *  weekLabel     string   Header label, e.g. 'Week 3 · Sep 8–12, 2026'
 *  title         string   Project/lesson title
 *  subtitle      string   Medium or theme (optional)
 *  gradeTargets  number[] Grades this lesson covers, e.g. [6, 7, 8]
 *  medium        string   Art medium shown as a tag (optional)
 *  objective     string   The full learning objective sentence
 *
 *  agenda        Array of { time: string, activity: string }
 *
 *  benchmarks    Object keyed by grade number:
 *                { 6: [{code, text}], 7: [...], 8: [...] }
 *                Florida NGSSS Visual Arts codes — VA.68.X.X.X
 *
 *  instructions  Array of { step: number, title: string, detail: string }
 *                Teacher can toggle "Step by Step" mode (one step at a time)
 *
 *  examples      Array of { title: string, description: string, imageUrl: string|null }
 *                Set imageUrl to a relative path like '../images/example.jpg'
 *                or a full URL. Leave null to show a placeholder.
 *
 *  videos        Array of {
 *                  title:       string
 *                  channel:     string
 *                  youtubeId:   string   (the 11-char ID from the YouTube URL)
 *                  duration:    string   e.g. '8:32'
 *                  purpose:     'Tutorial' | 'Art History' | 'Reference'
 *                  description: string
 *                }
 *
 * ═════════════════════════════════════════════════════════════
 */

window.LESSONS = [

  /* ────────────────────────────────────────────────────────
     WEEK 1 · Introduction to Value: Light & Shadow
     ──────────────────────────────────────────────────────── */
  {
    id: 'week-01-2026',
    weekLabel: 'Week 1 · Aug 25–29, 2026',
    title: 'Introduction to Value',
    subtitle: 'Light, Shadow & Graphite',
    gradeTargets: [6, 7, 8],
    medium: 'Graphite Pencil',

    objective: 'Students will identify and apply the five values of shading to create the illusion of three-dimensional form on a two-dimensional surface using graphite pencils.',

    agenda: [
      { time: '5 min',  activity: 'Warm-up: Create a 5-step value scale in your sketchbook' },
      { time: '10 min', activity: 'Direct instruction: Elements of shading & identifying light sources' },
      { time: '8 min',  activity: 'Video: How to shade a sphere — the 5 values of light (Proko)' },
      { time: '25 min', activity: 'Studio work: Still life value drawing from observation' },
      { time: '2 min',  activity: 'Clean-up and submit completed work to the class tray' },
    ],

    benchmarks: {
      6: [
        { code: 'VA.68.O.1.1', text: 'Apply the elements of art and principles of design in artmaking to develop compositional skills.' },
        { code: 'VA.68.S.1.1', text: 'Experiment with art media, tools, and processes to develop skills, techniques, and ideas for artistic expression.' },
      ],
      7: [
        { code: 'VA.68.O.1.1', text: 'Apply the elements of art and principles of design in artmaking to develop compositional skills.' },
        { code: 'VA.68.S.1.1', text: 'Experiment with art media, tools, and processes to develop skills, techniques, and ideas for artistic expression.' },
        { code: 'VA.68.O.2.1', text: 'Create 2-D or 3-D artwork using multiple art media and techniques to develop personal artistic style.' },
      ],
      8: [
        { code: 'VA.68.O.1.1', text: 'Apply the elements of art and principles of design in artmaking to develop compositional skills.' },
        { code: 'VA.68.S.1.1', text: 'Experiment with art media, tools, and processes to develop skills, techniques, and ideas for artistic expression.' },
        { code: 'VA.68.O.2.1', text: 'Create 2-D or 3-D artwork using multiple art media and techniques to develop personal artistic style.' },
        { code: 'VA.68.C.1.1', text: 'Critique personal artworks using art vocabulary, criteria, and art criticism strategies.' },
      ],
    },

    instructions: [
      {
        step: 1,
        title: 'Create your value scale',
        detail: 'Draw 5 connected boxes across the top of your paper. Fill them from left (white — no pencil pressure) to right (solid black — maximum pressure). Label each: Highlight · Light · Mid-tone · Shadow · Cast Shadow.',
      },
      {
        step: 2,
        title: 'Sketch the basic form lightly',
        detail: 'Using a hard pencil (H or 2H), lightly sketch a sphere or cube in the center of your paper. Press very gently — these are construction lines. Leave a 1-inch margin on all sides.',
      },
      {
        step: 3,
        title: 'Identify your light source',
        detail: 'Draw a small sun symbol in the upper corner of your paper. This marks where the light comes from. Everything facing the sun stays light; everything facing away falls into shadow.',
      },
      {
        step: 4,
        title: 'Apply the five values',
        detail: 'Start with the mid-tone value and work outward. Use smooth, circular pencil strokes and build up layers gradually. Save the white of your paper for the brightest highlight. Use a blending stump or fingertip to smooth transitions.',
      },
      {
        step: 5,
        title: 'Add the cast shadow',
        detail: 'The cast shadow falls on the surface beneath the object, on the opposite side from the light. Make it darkest where it meets the object and gradually lighter as it extends outward.',
      },
      {
        step: 6,
        title: 'Refine and submit',
        detail: 'Step back and evaluate your drawing. Does the form look three-dimensional? Sharpen edges near the shadow side, soften near the light. Erase visible construction lines. Write your name on the back and submit.',
      },
    ],

    examples: [
      {
        title: 'Value Scale Reference',
        description: 'Five-step gradient from white to black — your target for the warm-up exercise.',
        imageUrl: null,
      },
      {
        title: 'Sphere with 5 Values Applied',
        description: 'All five values correctly placed — notice the sharpest edge is between shadow and mid-tone.',
        imageUrl: null,
      },
      {
        title: 'Common Mistakes to Avoid',
        description: 'Even pressure throughout · Skipping transitions · Forgetting the cast shadow · Pressing too hard for highlights.',
        imageUrl: null,
      },
    ],

    videos: [
      {
        title: 'How to Shade — The 5 Values of Light',
        channel: 'Proko',
        youtubeId: 'D7_mHY-TTCM',
        duration: '8:32',
        purpose: 'Tutorial',
        description: 'Clear step-by-step breakdown of applying the five values to a sphere — ideal for beginners.',
      },
      {
        title: 'Chiaroscuro: The Art of Light and Shadow',
        channel: 'Smarthistory',
        youtubeId: 'UHrfcxZHldk',
        duration: '5:14',
        purpose: 'Art History',
        description: 'How Caravaggio and Renaissance masters used dramatic light and shadow to create depth and emotion.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────
     WEEK 2 · Color Theory: The Color Wheel
     ──────────────────────────────────────────────────────── */
  {
    id: 'week-02-2026',
    weekLabel: 'Week 2 · Sep 1–5, 2026',
    title: 'Color Theory: The Color Wheel',
    subtitle: 'Primary, Secondary & Tertiary Colors',
    gradeTargets: [6, 7, 8],
    medium: 'Tempera or Acrylic Paint',

    objective: 'Students will identify primary, secondary, and tertiary colors and demonstrate color mixing skills to create a completed twelve-part color wheel using paint.',

    agenda: [
      { time: '5 min',  activity: 'Warm-up: List every color you can think of — which are primary, secondary, or tertiary?' },
      { time: '12 min', activity: 'Direct instruction: Hue, tint, shade, tone — and the color wheel structure' },
      { time: '6 min',  activity: 'Video: Understanding Color Theory for Beginners (Adobe)' },
      { time: '25 min', activity: 'Studio work: Mix and paint your 12-part color wheel' },
      { time: '2 min',  activity: 'Clean brushes, return materials, place in drying rack' },
    ],

    benchmarks: {
      6: [
        { code: 'VA.68.O.1.1', text: 'Apply the elements of art and principles of design in artmaking to develop compositional skills.' },
        { code: 'VA.68.S.1.1', text: 'Experiment with art media, tools, and processes to develop skills, techniques, and ideas for artistic expression.' },
      ],
      7: [
        { code: 'VA.68.O.1.1', text: 'Apply the elements of art and principles of design in artmaking to develop compositional skills.' },
        { code: 'VA.68.S.1.1', text: 'Experiment with art media, tools, and processes to develop skills, techniques, and ideas for artistic expression.' },
        { code: 'VA.68.O.2.1', text: 'Create 2-D or 3-D artwork using multiple art media and techniques to develop personal artistic style.' },
      ],
      8: [
        { code: 'VA.68.O.1.1', text: 'Apply the elements of art and principles of design in artmaking to develop compositional skills.' },
        { code: 'VA.68.S.1.1', text: 'Experiment with art media, tools, and processes to develop skills, techniques, and ideas for artistic expression.' },
        { code: 'VA.68.O.2.1', text: 'Create 2-D or 3-D artwork using multiple art media and techniques to develop personal artistic style.' },
        { code: 'VA.68.C.2.1', text: 'Describe, analyze, and interpret works of art by selecting and applying established criteria.' },
      ],
    },

    instructions: [
      {
        step: 1,
        title: 'Draw the color wheel template',
        detail: 'Using a compass or traced circle, draw a large circle (at least 8 inches) on your paper. Divide it into 12 equal sections like a clock. In pencil, label positions at 3, 7, and 11 o\'clock: Red, Yellow, Blue.',
      },
      {
        step: 2,
        title: 'Paint the three primary colors',
        detail: 'Fill in Red, Yellow, and Blue directly from the paint — do not mix. Space them evenly around the wheel. Let these three sections begin to dry before continuing.',
      },
      {
        step: 3,
        title: 'Mix and paint the secondary colors',
        detail: 'Paint the three sections between your primaries: Red + Yellow = Orange · Yellow + Blue = Green · Blue + Red = Violet. Mix on your palette first — don\'t mix on the paper.',
      },
      {
        step: 4,
        title: 'Mix the six tertiary colors',
        detail: 'Fill in the remaining 6 sections by blending adjacent primary and secondary colors: Red-Orange · Yellow-Orange · Yellow-Green · Blue-Green · Blue-Violet · Red-Violet.',
      },
      {
        step: 5,
        title: 'Outline when dry (optional)',
        detail: 'Once fully dry, outline each section with a fine brush dipped in black or use a black fine-liner marker. This creates a clean, graphic appearance.',
      },
      {
        step: 6,
        title: 'Label and submit',
        detail: 'Write each color name inside or below its section in neat lettering. Write your name on the back and place in the drying rack or class tray.',
      },
    ],

    examples: [
      {
        title: 'Completed Color Wheel — 12 Colors',
        description: 'All 12 hues evenly spaced, clearly differentiated, no muddy colors. Notice the clean transitions.',
        imageUrl: null,
      },
      {
        title: 'Primary Color Placement',
        description: 'Red at 3 o\'clock · Yellow at 7 o\'clock · Blue at 11 o\'clock — evenly distributed.',
        imageUrl: null,
      },
      {
        title: 'Color Mixing on Palette',
        description: 'Always mix on the palette first. Load one color, add the second gradually until you reach the correct hue.',
        imageUrl: null,
      },
    ],

    videos: [
      {
        title: 'Understanding Color Theory for Beginners',
        channel: 'Adobe Creative Cloud',
        youtubeId: 'L1CK9bE3H_s',
        duration: '4:45',
        purpose: 'Tutorial',
        description: 'Clear visual introduction to the color wheel, primary and secondary colors, and color relationships.',
      },
      {
        title: 'The Impressionists and Color',
        channel: 'Smarthistory',
        youtubeId: 'qBsD-J3dHrc',
        duration: '7:18',
        purpose: 'Art History',
        description: 'How Monet, Renoir, and the Impressionists broke the rules of color to revolutionize painting.',
      },
    ],
  },

  /* ════════════════════════════════════════════════════════
     ADD NEXT LESSON BELOW THIS LINE ↓
     ════════════════════════════════════════════════════════
     Copy the block above, update all fields, and save.
     Push to GitHub — the live site updates automatically.
     ════════════════════════════════════════════════════════ */

]; // end LESSONS
