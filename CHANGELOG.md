All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.2] - 2022-06-08

### Changed

- Updated README and upgraded NPM dependencies

## [1.0.1] - 2020-07-02

### Changed

- Fixed an error in the examples in README.md. No code change

## [1.0.0] - 2020-05-15

### Changed

- Declare return type as tuple in result type interface
- Compile to ES2019

## [1.0.0-beta.2]

### Changed

- Converted the `result` and `error` properties to getters
  This improved type inference of the `result` property

## [1.0.0-beta.1]

### Changed

- Only updates to the README file

## [1.0.0-beta.0]

### Changed

- Removed all the `collection` classes. The `all()` and `allSettled()` methods
  instead return `Result` implementations.

### Fixed

- The type inference of `all()` and `allSettled()` now seems to behave the same
  as the native `Promise.all()` and `Promise.allSettled()`.

## [0.0.3-beta.0] - 2020-05-01

### Added

- Typeguard methods `isCollection()`, `isSuccessCollection()` and
  `isFailureCollection()`.
- A `Collection`, `SuccessCollection` and `FailureCollection` class.
- `allSettled()` which acts like `Promise.allSettled()`. This will not abort
  on rejections, and will return all promises resolved whether they were
  successful or not

## [0.0.2-1] - 2020-04-29

### Changed

- Renamed the `truthy` and `falsy` properties to `success` and `failure` in
  `SuccessResult` and `FailureResult`
- Removed the `yes` and `no` properites in `SuccessResult` and `FailureResult`

## [0.0.2-0] - 2020-04-29

### Added

- Inital commit
