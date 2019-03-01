# Buildkite Frontend (Archived) 📦

For a few years we experimented with developing the Buildkite frontend in an open source repository. In the beginning when our team was small, maintenance of this codebase was easy and it's integration with our main application was minimal.

Over time our team has grown, and so has the size and importance of this codebase. After many weeks of discussion, we decided to stop development in this repoistory, and move it back into our main application (creating a monolith).

The biggest reasons we moved it back where:

 - Day to day development was complicated between our backend application and the frontend code. It was difficult to document and communicate to new members of the team why this seperation existed and what the benefits were. The idea was eventually the code here become a seperate application that could run indepently of the backend application - but we never got around to it. So the code here ended up becoming an akward dependency of our main application that we managed with git submodules.
 - Maintaining 2 PRs for features wasn't fun (we had a backend PR and a frontend PR for the same feature. Keeping them both in sync was mostly busywork for little benefit)
 - Our deployment & testing processes were simplified by unifying the codebases
 - We didn't have to worry about "have you got the latest version of the frontend" type problems in development
 - We don't need to disclose any feature experiements we may be shipping to production that require frontend changes
 
We're keeping this code public for historical reasons, but the repo will be achived and no longer be developed in.
 
It's been a few weeks since we made the move, and we've been way more productive with the unifided codebases, and our day to day development experience is simpler. We're sad to no longer have the code be open source, because it brought us joy to have it out in the open, but we hope the increased rate of feature development in Buildkite makes up for that.

If you'd like to keep in sync with the changes we're making - we're posting more and more to our public changelog here: http://buildkite.com/changelog

## License

See [LICENSE.txt](LICENSE.txt) (MIT)
