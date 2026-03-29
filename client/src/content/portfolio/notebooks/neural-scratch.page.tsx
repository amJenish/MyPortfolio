import {
  WorkExecutiveSummary,
  WorkFigure,
  WorkFooterLinks,
  WorkFramingQuestion,
  WorkProsCons,
  WorkSectionLabel,
} from "../_shared";

export const workPageSections = [
  { id: "summary", label: "Summary" },
  { id: "components", label: "1. Components" },
  { id: "takeaways", label: "2. Takeaways" },
] as const;

export default function NeuralScratchPage() {
  return (
    <div className="work-report-body space-y-10 text-sm leading-relaxed text-foreground sm:text-base">
      <WorkExecutiveSummary
        paragraphs={[
          "A feedforward network implemented in NumPy only—activations, losses, forward/backward passes, and gradient clipping—without PyTorch/TensorFlow. The goal is pedagogy: seeing shapes, vanishing gradients, and why clipping matters, while still fitting small binary classification demos.",
        ]}
      />
      <WorkFramingQuestion>What is actually happening inside a dense net if you strip away framework autodiff?</WorkFramingQuestion>

      <section className="space-y-4">
        <WorkSectionLabel number={1} title="Components" id="components" />
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>ActivationFunction: linear, sigmoid, tanh, ReLU, leaky ReLU + derivatives</li>
          <li>LossFunction: MSE, MAE, binary cross-entropy + gradients</li>
          <li>Neuron + Network: forward/backward, clipping, fit/predict API</li>
        </ul>
      </section>

      <section className="space-y-4">
        <WorkSectionLabel number={2} title="Takeaways" id="takeaways" />
        <p className="text-muted-foreground">
          Training is slower and more brittle than a framework, but you earn intuition for initialization, activation choice, and
          loss scaling. Width/depth are easy to extend because layers are explicit objects.
        </p>
        <WorkProsCons
          pros={[
            "Built every layer from scratch so backprop and shapes are explicit—great for learning and explaining the stack.",
            "Swappable activations and losses without fighting framework defaults.",
            "Added gradient clipping early because training stability was part of the exercise.",
          ]}
          cons={[
            "I wouldn't push this to large data or GPU-scale workloads—it's a learning implementation by design.",
            "Next time I'd lean on PyTorch for speed once the concepts are nailed down.",
          ]}
        />
      </section>

      <WorkFigure
        src="/portfolio/notebooks/neural-scratch/loss.png"
        alt="Training loss"
        caption="Optional: loss/decision-boundary plots in client/public/portfolio/notebooks/neural-scratch/."
        placeholder
      />

      <WorkFooterLinks
        github="https://github.com/amJenish/Neural-Network-From-Scratch"
        notebook="https://nbviewer.org/github/amJenish/Neural-Network-From-Scratch/blob/main/Neural%20Network%20From%20Scratch.ipynb"
        notebookLabel="Notebook (nbviewer)"
      />
    </div>
  );
}
