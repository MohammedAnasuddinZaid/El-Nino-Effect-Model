import { getUiCopy } from '../data/i18n'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { useExperience } from '../store/useExperience'
import { Icon } from './Icons'

/**
 * "Get the app" control. One tap installs on Chrome / Edge / Android; on iOS we
 * open a short instruction card because Safari has no install prompt event.
 */
export function InstallControl() {
  const language = useExperience((state) => state.language)
  const copy = getUiCopy(language)
  const { canInstall, installed, iosLike, hintOpen, install, closeHint } = useInstallPrompt()

  if (installed) {
    return (
      <span className="install-button is-installed" aria-label={copy.installInstalled}>
        <Icon name="check" size={15} />
        <span className="install-button__label">{copy.installInstalled}</span>
      </span>
    )
  }

  if (!canInstall) return null

  const steps = iosLike ? copy.installIosHint : copy.installAndroidHint

  return (
    <div className="install-control">
      <button
        type="button"
        className="install-button"
        onClick={() => void install()}
        aria-label={copy.installAria}
        aria-haspopup="dialog"
        aria-expanded={hintOpen}
        data-tooltip={copy.installApp}
      >
        <Icon name="download" size={15} />
        <span className="install-button__label">{copy.installApp}</span>
      </button>

      {hintOpen ? (
        <div className="install-hint" role="dialog" aria-label={copy.installTitle}>
          <button
            type="button"
            className="install-hint__close"
            onClick={closeHint}
            aria-label={copy.installClose}
          >
            <Icon name="close" size={14} />
          </button>
          <strong className="install-hint__title">{copy.installTitle}</strong>
          <p className="install-hint__body">{copy.installBody}</p>
          <p className="install-hint__steps mono">{steps}</p>
          {iosLike ? null : <p className="install-hint__steps mono">{copy.installDesktopHint}</p>}
        </div>
      ) : null}
    </div>
  )
}
