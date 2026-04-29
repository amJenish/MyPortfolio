import { WorkFigure, WorkSectionLabel } from "../_shared";
import type { WorkPageProps } from "../workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

export const workPageSections = [
  { id: "summary", label: "Overview" },
  { id: "components", label: "1. Components" },
  { id: "takeaways", label: "2. Takeaways" },
] as const;

export default function NeuralScratchPage(props: WorkPageProps) {
  return (
    <WorkReportShell {...props}>
      <div className="theme-body work-report-body mx-auto max-w-[min(100%,60rem)] space-y-10 px-4 pb-16 text-sm sm:px-6 sm:text-base">
        <section className="scroll-mt-28 space-y-4">
          <WorkSectionLabel number={1} title="Overview" id="summary" />
          <p className="text-report-body">
            A feedforward network implemented in NumPy only—activations, losses, forward/backward passes, and gradient clipping—without PyTorch/TensorFlow. The goal is pedagogy: seeing shapes, vanishing gradients, and why clipping matters, while still fitting small binary classification demos.
          </p>
          <p className="border-l-2 border-primary/50 pl-4 leading-[1.6] text-muted-foreground">
            What is actually happening inside a dense net if you strip away framework autodiff?
          </p>
        </section>

        <section className="space-y-4">
          <WorkSectionLabel number={2} title="Components" id="components" />
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>ActivationFunction: linear, sigmoid, tanh, ReLU, leaky ReLU + derivatives</li>
            <li>LossFunction: MSE, MAE, binary cross-entropy + gradients</li>
            <li>Neuron + Network: forward/backward, clipping, fit/predict API</li>
          </ul>
        </section>

        <section className="space-y-6">
          <WorkSectionLabel number={3} title="Takeaways" id="takeaways" />
          <p className="text-muted-foreground">
            Training is slower and more brittle than a framework, but you earn intuition for initialization, activation choice, and
            loss scaling. Width/depth are easy to extend because layers are explicit objects.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">What went well</h3>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
                <li>Built every layer from scratch so backprop and shapes are explicit—great for learning and explaining the stack.</li>
                <li>Swappable activations and losses without fighting framework defaults.</li>
                <li>Added gradient clipping early because training stability was part of the exercise.</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Future improvements</h3>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
                <li>I wouldn&apos;t push this to large data or GPU-scale workloads—it&apos;s a learning implementation by design.</li>
                <li>Next time I&apos;d lean on PyTorch for speed once the concepts are nailed down.</li>
              </ul>
            </div>
          </div>
        </section>

        <WorkFigure
          src="/portfolio/notebooks/neural-scratch/loss.png"
          alt="Training loss"
          caption="Optional: loss/decision-boundary plots in client/public/portfolio/notebooks/neural-scratch/."
          placeholder
        />
      </div>
    </WorkReportShell>
  );
}


