import { CheckCircle } from "lucide-react"

const steps = [
  { name: 'Breathe', href: '/breathe', status: 'upcoming' },
  { name: 'Senses', href: '/senses', status: 'upcoming' },
  { name: 'Talk', href: '/talk', status: 'upcoming' },
  { name: 'Summary', href: '/summary', status: 'upcoming' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Progress({ currentStep, className }: { currentStep: number, className?: string }) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex opacity-50 transition-opacity duration-300 items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>
            {stepIdx < currentStep ? (
              <>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-teal-700" />
                </div>
                <a
                  href="#"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full peer bg-teal-600 hover:bg-teal-700 transition-colors duration-300"
                >
                  <CheckCircle aria-hidden="true" className="h-5 w-5 text-white" />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : step.status === 'current' ? (
              <>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  aria-current="step"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-teal-600 bg-white"
                >
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-teal-600" />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : (
              <>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
                >
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                  />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}