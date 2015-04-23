# Make some commands not show up in history
export HISTIGNORE="ls:ls *:cd:cd -:pwd;exit:date:* --help"

# command history configuration
if [ -z $HISTFILE ]; then
    HISTFILE=$HOME/.zsh_history
fi

HISTSIZE=10000
SAVEHIST=10000
HISTFILESIZE=$HISTSIZE

# larger bash history (allow 32³ entries; default is 500)
export HISTCONTROL=ignoredups

setopt append_history
setopt extended_history
setopt hist_expire_dups_first

# ignore duplication command history list
setopt hist_ignore_dups
setopt hist_ignore_space
setopt hist_verify
setopt inc_append_history

# share command history data
setopt share_history
