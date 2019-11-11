/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React from "react";
import { GlobalStyle } from "@looker/components";
import { theme } from "@looker/design-tokens";
import { ThemeProvider } from "styled-components";
import map from "lodash/map";
import find from "lodash/find";
import round from "lodash/round";

import Carbon from "./Carbon/Carbon";
import { ExtensionContext } from "@looker/extension-sdk-react";

interface CarbonUsage {
  "zip_centroids.app_groupings": { value: "Plane" | "Car" | "Transit" };
  "zip_centroids.total_carbon_emitted": { rendered: string; value: number };
}

interface ExtensionState {
  queryResult?: CarbonUsage[];
  runningQuery: boolean;
  loadingLooks: boolean;
  responseCount: number;
  errorMessage?: string;
}

class ExtensionInternal extends React.Component<{}, ExtensionState> {
  static contextType = ExtensionContext;

  constructor(props: any) {
    super(props);
    this.parseQueryResults = this.parseQueryResults.bind(this);
    this.runQuery = this.runQuery.bind(this);
    this.getResponseCount = this.getResponseCount.bind(this);
    this.notifyUsers = this.notifyUsers.bind(this);

    this.state = {
      queryResult: undefined,
      runningQuery: false,
      loadingLooks: true,
      responseCount: 0
    };
  }

  componentDidMount() {
    this.context.extensionSDK.updateTitle("Carbon Offset - JOIN 2019");
    this.initialize();
  }

  async initialize() {
    await this.runQuery();
  }

  // TEMPLATE CODE FOR RUNNING ANY QUERY
  async runQuery() {
    try {
      const result = await this.context.coreSDK.ok(
        this.context.coreSDK.run_inline_query({
          result_format: "json_detail",
          limit: 10,
          body: {
            total: false,
            model: "join2019",
            view: "survey_responses",
            fields: [
              "zip_centroids.total_carbon_emitted",
              "zip_centroids.app_groupings"
            ],
            filters: {
              "survey_responses.submitted_time": "after 2019/10/24 15:10",
              "zip_centroids.app_groupings": "-NULL"
            }
          }
        })
      );
      this.setState({
        queryResult: result.data,
        runningQuery: false
      });
    } catch (error) {
      this.setState({
        queryResult: [],
        runningQuery: false,
        errorMessage: "Unable to run query"
      });
    }
  }

  parseQueryResults() {
    const { queryResult } = this.state;

    const plane = find(queryResult, {
      "zip_centroids.app_groupings": { value: "Plane" }
    });
    const auto = find(queryResult, {
      "zip_centroids.app_groupings": { value: "Car" }
    });
    const other = find(queryResult, {
      "zip_centroids.app_groupings": { value: "Transit" }
    });

    const planeCarbon = plane
      ? round(plane["zip_centroids.total_carbon_emitted"].value)
      : 0;
    const autoCarbon = auto
      ? round(auto["zip_centroids.total_carbon_emitted"].value)
      : 0;
    const otherCarbon = other
      ? round(other["zip_centroids.total_carbon_emitted"].value)
      : 0;

    return { planeCarbon, autoCarbon, otherCarbon };
  }

  async getResponseCount() {
    const response = await this.context.coreSDK.run_look({
      look_id: 710,
      result_format: "json"
    });
    this.setState({
      responseCount: response.value.length
    });
  }

  async notifyUsers() {
    const plan = await this.context.coreSDK.create_scheduled_plan({
      name: "carbon user notification",
      look_id: 710,
      run_once: true,
      require_no_results: false,
      require_results: false,
      require_change: false,
      datagroup: "garbage",
      scheduled_plan_destination: [
        {
          format: "json_detail",
          type: "looker-integration://2::twilio_message_table"
        }
      ]
    });
    await this.context.coreSDK.scheduled_plan_run_once(plan.value);
  }

  render() {
    const { planeCarbon, autoCarbon, otherCarbon } = this.parseQueryResults();

    return (
      <>
        {this.state.errorMessage && (
          <div
            style={{ backgroundColor: "red", color: "white", height: "20px" }}
          >
            {this.state.errorMessage}
          </div>
        )}
        <ThemeProvider theme={theme}>
          <>
            <GlobalStyle />
            <Carbon
              autoCarbon={autoCarbon}
              planeCarbon={planeCarbon}
              otherCarbon={otherCarbon}
              getResponseCount={this.getResponseCount}
              responseCount={this.state.responseCount}
              notifyUsers={this.notifyUsers}
            />
          </>
        </ThemeProvider>
      </>
    );
  }
}

export const Extension = ExtensionInternal;
